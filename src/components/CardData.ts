import { ICard, ICardPreview } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardPreview {
	protected _cards: ICard[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
		this.events.emit('cards:changed');
	}

	get cards() {
		return this._cards;
	}

	getCard(cardId: string) {
		return this.cards.find((item) => item.id === cardId);
	}
}
