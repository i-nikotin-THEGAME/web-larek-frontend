import { ICard, ICardPreview } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardPreview {
	protected _cards: ICard[];
	protected selectedCardId: string;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards:ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed')
    }

    get cards () {
        return this._cards;
    }

	getCardId(cardId: string) {
		return this.cards.find((item) => item.id === cardId);
	}

	set preview(cardId: string | null) {
		if (!cardId) {
			this.selectedCardId = null;
			return;
		}
		const selectedCard = this.getCardId(cardId);
		if (selectedCard) {
			this.selectedCardId = cardId;
			this.events.emit('card-preview:select');
		}
	}
}
