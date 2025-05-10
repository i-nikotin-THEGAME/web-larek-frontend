import { ICard } from '../types';
import { formatPrice } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

const CATEGORY_MODIFIERS: Record<string, string> = {
	другое: 'other',
	'софт-скил': 'soft',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};

export class Card extends Component<ICard> {
	protected events: IEvents;
	protected card: HTMLElement;
	protected cardCategory: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardDescription: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardPrice: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected cardId: string;
	protected isSelected: boolean = false;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.card = this.container;
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardDescription = this.container.querySelector('.card__text');
		this.cardButton = this.container.querySelector('.card__button');

		if (this.cardButton) {
			this.cardButton.addEventListener('click', () =>
				this.events.emit('item-basket:add', { card: this })
			);
		}
		this.card.addEventListener('click', () =>
			this.events.emit('card-preview:open', { card: this })
		);
		// }
	}

	render(data: Partial<ICard>): HTMLElement {
		if (data) {
			this.cardCategory.className = 'card__category';

			if (data.category) {
				const categoryClass = this.getCategoryModifier(data.category);
				this.cardCategory.classList.add(categoryClass);
			}
			this.cardCategory.textContent = data.category || '';
			this.cardTitle.textContent = data.title || '';
			this.cardImage.src = data.image || '';
			this.cardImage.alt = data.title || '';
			if (data.price !== null) {
				if (this.cardButton) {
					this.cardButton.disabled = false;
				}
				this.cardPrice.textContent = `${formatPrice(data.price)} синапсов`;
			} else {
				this.cardPrice.textContent = 'Бесценно';
				if (this.cardButton) {
					this.cardButton.disabled = true;
				}
			}
			if (this.cardDescription !== null) {
				this.cardDescription.textContent = data.description || ``;
			}
			this.cardId = data.id || '';
		}
		return this.container;
	}

	private getCategoryModifier(category: string): string {
		const normalizedCategory = category.toLowerCase();

		for (const [key, value] of Object.entries(CATEGORY_MODIFIERS)) {
			if (normalizedCategory.includes(key)) {
				return `card__category_${value}`;
			}
		}
	}

	get id() {
		return this.cardId;
	}
}
