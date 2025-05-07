import { Component } from '../base/Component';
import { createElement, ensureElement, formatPrice } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IBasketItem, IBasketView } from '../../types';

export class Basket extends Component<IBasketView> {
	protected basketItems: IBasketItem[] = [];
	protected list: HTMLElement;
	protected _total: HTMLElement;
	protected button: HTMLElement;
	protected selected: string;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.modal__actions');
		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
	}

	get basketList(): HTMLElement[] {
		return this.basketItems.map((item) => item.element);
	}

	get lengthBasketItems(): number {
		return this.basketItems.length;
	}

	addItem(data: IBasketItem): void {
		if (!this.basketItems.some((item) => item.id === data.id)) {
			this.basketItems.push(data);
			this.updateTotal();
			this.events.emit('basket:changed');
		}
	}

	deleteItem(data: string): void {
		const index = this.basketItems.findIndex((item) => item.id === data);
		if (index !== -1) {
			this.basketItems.splice(index, 1);
			this.updateTotal();
			this.events.emit('basket:changed');
		}
		console.log('basketItems', this.basketItems, index);
	}

	updatwBasketItems(items: HTMLElement[]) {
		if (this.basketItems.length) {
			items.forEach((item, index) => {
				const indexSpan = item.querySelector('.basket__item-index');
				if (indexSpan) {
					indexSpan.textContent = String(index + 1);
				}
				this.list.replaceChildren(...items);
			});
		} else {
			this.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	private updateTotal(): void {
		const total = this.basketItems.reduce((sum, item) => sum + item.price, 0);
		this.setText(this._total, `${formatPrice(total)} синапсов`);
	}
}
