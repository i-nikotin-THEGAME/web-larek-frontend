import { ICard, ICardsData } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardsData {
	protected _cards: ICard[];

	constructor(protected events: IEvents) {
	}

	set cards(cards: ICard[]) {
		this._cards = cards.map(card => ({
            ...card,
            isSelected: false
        }));
	}

	get cards() {
		return this._cards;
	}

	getCard(cardId: string): ICard {
		return this.cards.find((item) => item.id === cardId);
	}

	getPrice(cardId: string): number {
		return  this.cards.find((item) => item.id === cardId).price;
		
	}

	setCardSelectedState(cardId: string, state: boolean): void {
        const cardIndex = this._cards.findIndex(item => item.id === cardId);
        if (cardIndex !== -1) {
            this._cards[cardIndex].isSelected = state;
        }
    }
	resetAllSelectedStates(): void {
        this._cards = this._cards.map(card => ({
            ...card,
            isSelected: false
        }));
    }
}
