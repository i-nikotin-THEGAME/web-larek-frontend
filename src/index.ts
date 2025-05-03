import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { CardData } from './components/CardData';
import { CardsContainer } from './components/CardsContainer';
import { ModalView } from './components/ModalView';
import './scss/styles.scss';
import { IApi } from './types';
import { API_URL, settings, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);

const cardsData = new CardData(events);
// const userData = new UserData(events);
// const userView = new UserInfo(document.querySelector('.profile'), events);

// const activeModal = new ModalView(document.querySelector('.modal'), events);
// const userModal = new ModalView(document.querySelector('.popup_type_edit'), events);
// const cardModal = new ModalView(document.querySelector('.popup_type_new-card'), events);
// const avatarModal = new ModalView(document.querySelector('.popup_type_edit-avatar'), events);
// const confirmModal = new ModalView(document.querySelector('.popup_type_remove-card'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardsContainer = new CardsContainer(document.querySelector('.gallery'));

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Получаем карточки с сервера
api
	.getCards()
	.then((initialCards) => {
		cardsData.cards = initialCards;
		console.log('Данные сервера', initialCards);
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

events.on('initialData:loaded', () => {
	if (!cardsData || !Array.isArray(cardsData.cards)) {
		console.error('Ожидался массив cards:', cardsData?.cards);
	}

	console.log('Данные класса', cardsData.cards);
	const cardsArray = cardsData.cards.map((card) => {
		console.log('Данные массива', card);
		const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), events);
		console.log('Данные темплейта', cardInstant);
		return cardInstant.render(card);
	});
	
	console.log('Данные для рендера', cardsArray);
	console.log('Данные класса для рендера', cardsData.cards);
	cardsContainer.render({ catalog: cardsArray });
});
