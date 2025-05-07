import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketItems, IBasketItem } from './components/BasketItems';
import { Card } from './components/Card';
import { CardData } from './components/CardData';
import { Basket } from './components/Basket';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IApi } from './types';
import { API_URL, settings, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);

const cardsData = new CardData(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modalContainer = new Modal(document.querySelector('.modal'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Получаем карточки с сервера
api
	.getCards()
	.then((initialCards) => {
		cardsData.cards = initialCards;
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

// Инициируем первоначальную загрузку страницы
events.on('initialData:loaded', () => {
	if (!cardsData || !Array.isArray(cardsData.cards)) {
		console.error('Ожидался массив cards:', cardsData?.cards);
	}

	page.catalog = cardsData.cards.map((card) => {
		const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), events);
		return cardInstant.render(card);
	});
});

// Открывается модальное окно просмотра карточки
events.on('card-preview:open', (data: { card: Card }) => {
	modalContainer.open(cardPreview.render(cardsData.getCard(data.card.id)));
});

// Открывается модальное окно просмотра корзины
events.on('basket:open', () => {
	modalContainer.open(basket.render());
});

// Рендерится список товаров корзины при добавлении товара
events.on('item-basket:add', (item: { card: IBasketItem }) => {
	const selectItem = cardsData.getCard(item.card.id);
	const basketItem = new BasketItems(cloneTemplate(cardBasketTemplate), events);
	const complitedItem = basketItem.render(selectItem);
	basket.addItem({
		element: complitedItem,
		id: selectItem.id,
		price: selectItem.price,
	});
});

// Рендерится список товаров корзины при удалении товара
events.on('item-basket:delete', (data: { id: string }) => {
	basket.deleteItem(data.id);
});

// Рендерится список товаров корзины при изменении данных и обновляется счетчик на главной странице
events.on('basket:changed', () => {
	basket.updatwBasketItems(basket.basketList);
	page.counter = basket.lengthBasketItems;
});

// Блокируем прокрутку страницы если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы если закрыто модальное окно
events.on('modal:close', () => {
	page.locked = false;
});
