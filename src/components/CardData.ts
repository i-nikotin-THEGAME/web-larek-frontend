import { ICard, ICardsData } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardsData {
	protected _cards: ICard[];
	protected _preview: string | null;

	constructor(protected events: IEvents) {
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
	}

	set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return;
        }
        const selectedCard = this.getCard(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected')
        }
    }

	get cards() {
		return this._cards;
	}

	get preview () {
        return this._preview;
    }

	getCard(cardId: string) {
		return this.cards.find((item) => item.id === cardId);
	}
}
