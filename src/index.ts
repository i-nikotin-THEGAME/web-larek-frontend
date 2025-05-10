import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketItems } from './components/BasketItems';
import { Card } from './components/Card';
import { CardData } from './components/CardData';
import { Basket } from './components/Basket';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IApi, TBaskeCompact, TFormContact, TFormOrder } from './types';
import { API_URL, settings, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Order } from './components/Oreder';
import { OrderData } from './components/OrderData';

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);

const cardsData = new CardData(events);
const orderData = new OrderData(events);

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
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);
const success = new Order(cloneTemplate(successTemplate), events);

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Получаем карточки с сервера
api
	.getCards()
	.then((initialCards) => {
		cardsData.cards = initialCards;
		console.log(initialCards)
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
	basket.updatwBasketItems([]);
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
	const modalBasket = basket.render();
	basket.updateTotal(orderData.getTotal);
	modalContainer.open(modalBasket);
});

// Рендерится список товаров корзины при добавлении товара
events.on('item-basket:add', (item: { card: TBaskeCompact }) => {
	orderData.addItem(item.card.id);
	orderData.setTotal = orderData.getTotal + cardsData.getPrice(item.card.id);
});

// Рендерится список товаров корзины при удалении товара
events.on('item-basket:delete', (data: { id: string }) => {
	orderData.deleteItem(data.id);
	orderData.setTotal = orderData.getTotal - cardsData.getPrice(data.id);
	basket.updateTotal(orderData.getTotal);
});

// Рендерится список товаров корзины при изменении данных и обновляется счетчик на главной странице
events.on('basket:changed', (cardId: { id: string }) => {
	const lislElement = orderData.getItems().map((card) => {
		const { id, title, price } = cardsData.getCard(card);
		const item = { id, title, price };
		const basketItem = new BasketItems(
			cloneTemplate(cardBasketTemplate),
			events
		);
		return basketItem.render(item);
	});
	basket.updatwBasketItems(lislElement);
	basket.updateTotal(orderData.getTotal);
	page.counter = orderData.getItems().length;
});

// Открывается модальное окно перехода к оформлению заказа
events.on('order:open', () => {
	modalContainer.open(order.render());
});

// Записывается способ оплаты
events.on(
	'order_payment:checked',
	(data: { payment: string; address?: string }) => {
		orderData.setPayment = data.payment;
		order.error = orderData.checkFieldOrder();
		order.valid = orderData.checkOrderValidation();
	}
);

// Валидация данных модального окна со способом оплаты и адреса
events.on('order:input', (data: { field: keyof TFormOrder; value: string }) => {
	orderData.setAddress = data.value;
	order.error = orderData.checkFieldOrder();
	order.valid = orderData.checkOrderValidation();
});
// Валидация данных модального окна с контактами
events.on(
	'contacts:input',
	(data: { field: keyof TFormContact; value: string }) => {
		if (data.field === 'email') {
			orderData.setEmail = data.value;
		} else {
			orderData.setPhone = data.value;
		}
		contacts.error = orderData.checkFieldContact();
		contacts.valid = orderData.checkContactValidation();
	}
);

/// Открывается модальное окно заполнения контактов
events.on('order:submit', () => {
	modalContainer.open(contacts.render());
});

// Отправка заказа на сервер
events.on('contacts:submit', () => {
	const orderPayload = orderData.payload;
	api
		.postOrder(orderPayload)
		.then((result) => {
			success.successDescription.textContent = `Списано ${result.total} синапсов`;
			orderData.clearOrder();
			order.resetForm();
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			modalContainer.open(success.render());
			events.emit('initialData:loaded');
		});
});

// Блокируем прокрутку страницы если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы если закрыто модальное окно
events.on('modal:close', () => {
	page.locked = false;
});
