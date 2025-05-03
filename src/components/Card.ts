import { ICard } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Card extends Component<ICard> {
	protected events: IEvents;
	protected card: HTMLButtonElement;
	protected cardCategory: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardPrice: HTMLElement;
	protected cardId: string;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.card = this.container.querySelector('.gallery__item');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardPrice = this.container.querySelector('.card__price');

		// this.card.addEventListener('click', () =>
		// 	this.events.emit('card-preview:open', { card: this })
		// );
	}

	// render(data?: Partial<ICard>): HTMLElement;
	// render(cardData: Partial<ICard>, userId: string): HTMLElement;
	set id(id) {
		this.cardId = id;
	}
	get id() {
		return this.cardId;
	}
}
