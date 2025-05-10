import { Component } from './base/Component';
import { createElement, ensureElement, formatPrice } from '../utils/utils';
import { IEvents } from './base/events';

export class Basket<T> extends Component<T> {
	protected list: HTMLElement;
	protected totalElement: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalElement = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');
		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
	}

	updatwBasketItems(basketList: HTMLElement[]): void {
		if (basketList.length) {
			this.button.disabled = false;
			basketList.forEach((item, index) => {
				const indexSpan = item.querySelector('.basket__item-index');
				if (indexSpan) {
					indexSpan.textContent = String(index + 1);
				}
				this.list.replaceChildren(...basketList);
			});
		} else {
			this.button.disabled = true;
			this.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	updateTotal(data: number): void {
		this.setText(this.totalElement, `${formatPrice(data)} синапсов`);
	}
}
