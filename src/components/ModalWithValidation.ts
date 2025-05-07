import { Modal } from './common/Modal';
import { IEvents } from './base/events';

interface IModal {
	valid: boolean;
	inputValues: Record<string, string>;
	error: Record<string, string>;
}

export class ModalWithValidation extends Modal<IModal> {
	protected inputs?: NodeListOf<HTMLInputElement>;
	protected _form?: HTMLFormElement;
	protected errors?: HTMLElement;
	protected formName?: string;
	protected submitButton?: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.inputs =
			this.container.querySelectorAll<HTMLInputElement>('.form__input');
		this._form = this.container.querySelector('.form');
		this.formName = this._form.getAttribute('name');
		this.submitButton = this._form.querySelector('.button');
		this.errors = this._form.querySelector('.form__errors');
		// this.inputs.forEach((input) => {
		// 	this.errors[input.name] = this._form.querySelector(`#${input.id}-error`);
		// });
		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
		});
		this._form.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { field, value });
		});
	}

	protected getInputValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

	set error(data: { field: string; value: string; validInformation: string }) {
		if (data.validInformation) {
			this.showInputError(data.field, data.validInformation);
		} else {
			this.hideInputError(data.field);
		}
	}

	protected showInputError(field: string, errorMessage: string) {
		this._form[field].textContent = errorMessage;
		// this.errors[field].textContent = errorMessage;
		// this.errors[field].classList.add('popup__error_visible');
	}

	protected hideInputError(field: string) {
		this._form[field].textContent = '';
		// this.errors[field].classList.remove('popup__error_visible');
		// this.errors[field].textContent = '';
	}

	set valid(isValid: boolean) {
		console.log({ isValid });
		// this.submitButton.classList.toggle('popup__button_disabled', !isValid);
		this.submitButton.disabled = !isValid;
	}

	get form() {
		return this._form;
	}

	close() {
		super.close();
		this._form.reset();
		this.inputs.forEach((element) => {
			this.hideInputError(element.name);
		});
	}
}
