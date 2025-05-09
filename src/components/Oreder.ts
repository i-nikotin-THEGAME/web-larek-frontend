import { IEvents } from './base/events';
import { Component } from './base/Component';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	paymentValues: string;
	error: Record<string, string>;
}

export class ModalWithForm extends Component<IForm> {
	protected inputs: NodeListOf<HTMLInputElement>;
	protected payment: NodeListOf<HTMLButtonElement>;
	private activePaymentButton: HTMLButtonElement | null = null;
	protected errors: HTMLElement;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	successButton: HTMLButtonElement | null = null;;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.inputs =
			this.container.querySelectorAll<HTMLInputElement>('.form__input');
		this.payment = this.container.querySelectorAll<HTMLButtonElement>(
			'.button[type="button"]');
		this.formName = this.container.getAttribute('name') || 'success';
		this.submitButton = this.container.querySelector('.button[type="submit"]');
		this.successButton = this.container.querySelector('.order-success__close');
		this.errors = this.container.querySelector('.form__errors');
		if (this.submitButton) {
			this.submitButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				this.events.emit(`${this.formName}:submit`);
			});
		}
		this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { field, value });
		});
		this.payment.forEach((button: HTMLButtonElement) => {
			button.addEventListener('click', (event) => {
				const target = event.currentTarget as HTMLButtonElement;
				this.events.emit(
					`${this.formName}_payment:checked`,
					this.checkedPayment(target)
				);
			});
		});
	}

	private checkedPayment(target: HTMLButtonElement): { payment: string } {
		if (this.activePaymentButton === target) {
			return { payment: target.name };
		}

		this.payment.forEach((button) => {
			button.classList.add('button_alt');
			button.classList.remove('button_alt-active');
		});
		target.classList.remove('button_alt');
		target.classList.add('button_alt-active');
		this.activePaymentButton = target;

		return { payment: target.name };
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

	set error(validInformation: string ) {
		if (validInformation) {
			this.showInputError(validInformation);
		} else {
			this.hideInputError();
		}
	}

	protected showInputError(errorMessage: string) {
		this.errors.textContent = errorMessage;
		this.errors.classList.add('modal__message_error');
	}

	protected hideInputError() {
		this.errors.classList.remove('modal__message_error');
		this.errors.textContent = '';
	}

	set valid(isValid: boolean) {
		console.log({ isValid });
		this.submitButton.disabled = !isValid;
	}

	// close() {
	// 	super.close();
	// 	this._form.reset();
	// 	this.inputs.forEach((element) => {
	// 		this.hideInputError(element.name);
	// 	});
	// }
}
