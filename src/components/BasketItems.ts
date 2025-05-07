import { Component } from "./base/Component";
import { formatPrice } from '../utils/utils';
import { IEvents } from "./base/events";
import { IBasketItem, TBasketList } from "../types";

export class BasketItems extends Component<IBasketItem> {
    protected events: IEvents;
    protected basketId: string;
    protected basketItem: HTMLElement;
    protected basketIndex: HTMLElement;
    protected basketTitle: HTMLElement;
    protected basketPrice: HTMLElement;
    protected buttonItemDelete: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.basketItem = this.container;
        this.basketIndex = this.container.querySelector('.basket__item-index');
        this.basketTitle = this.container.querySelector('.card__title');
        this.basketPrice = this.container.querySelector('.card__price');
        this.buttonItemDelete = this.container.querySelector('.basket__item-delete'); 
        if (this.buttonItemDelete) {
            this.buttonItemDelete.addEventListener('click', () => {
                events.emit('item-basket:delete', {id: this.basketId});
            });
        }
    }

    render(data?: Partial<TBasketList>): HTMLElement {
        if (data) {
            this.basketTitle.textContent = data.title || '';
            if (data.price !== null) {
				this.basketPrice.textContent = `${formatPrice(data.price)} синапсов`;
			} else {
				this.basketPrice.textContent = 'Бесценно';
			};
			
            this.basketId = data.id || '';
        }
        return this.container
    }

    get id() {
		return this.basketId;
	}
}
