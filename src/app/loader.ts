import { garage, winners } from './types';
import Garage from './garage/garage';
import Winners from './winners/winners';

class Loader {
    garageList: Array<garage> = [];
    winnersList: Array<winners> = [];
    garage: Garage;
    winners: Winners;

    constructor(public baseLink: string) {
        this.getGarage();
        this.getWinners();
        (document.querySelector('.header') as HTMLElement).addEventListener('click', (e) => this.switchPagesEvent(e));
        (document.querySelector('.form_create') as HTMLFormElement).addEventListener('submit', (e) =>
            this.createCar(e),
        );
        (document.querySelector('.form_update') as HTMLFormElement).addEventListener('submit', (e) =>
            this.updateCar(e),
        );
        (document.querySelector('#garageList') as HTMLElement).addEventListener('click', (e) => this.buttonEvent(e));
        this.garage = new Garage();
        this.winners = new Winners();
    }

    async buttonEvent(e: Event) {
        const target = e.target as HTMLElement;
        if (target.classList.contains('button_remove')) {
            const carId = Number(target.closest('.car')!.getAttribute('data-carId'));
            await fetch(`${this.baseLink}/garage/${carId}`, {
                method: 'DELETE',
            });
            if (this.winnersList.some((winner) => winner.id === carId)) {
                await fetch(`${this.baseLink}/winners/${carId}`, {
                    method: 'DELETE',
                });
                this.getWinners();
            }
            this.getGarage();
        } else if (target.classList.contains('button_select')) {
            const carId = Number(target.closest('.car')!.getAttribute('data-carId'));
            const updateForm = document.querySelector('.form_update') as HTMLFormElement;
            const inputText = updateForm.querySelector('.input_text') as HTMLInputElement;
            const inputColor = updateForm.querySelector('.input_color') as HTMLInputElement;
            const inputId = updateForm.querySelector('.input_id') as HTMLInputElement;
            inputText.disabled = false;
            inputColor.disabled = false;
            (updateForm.querySelector('button') as HTMLButtonElement).disabled = false;
            const car = this.garageList.find((car) => car.id === carId);
            inputText.value = car!.name;
            inputColor.value = car!.color;
            inputId.value = `${car!.id}`;
        }
    }

    async getGarage() {
        this.garageList = await fetch(`${this.baseLink}/garage`).then((res) => res.json());
        this.garage.draw(this.garageList);
    }

    async getWinners() {
        this.winnersList = await fetch(`${this.baseLink}/winners`).then((res) => res.json());
        this.winners.draw(this.winnersList, this.garageList);
    }

    async updateCar(e: Event) {
        e.preventDefault();
        const formElement = e.currentTarget as HTMLFormElement;
        const car = Object.fromEntries(new FormData(formElement));
        await fetch(`${this.baseLink}/garage/${car.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(car),
        });
        this.getGarage();
        this.getWinners();
        formElement.reset();
        (formElement.querySelector('.input_text') as HTMLInputElement).disabled = true;
        (formElement.querySelector('.input_color') as HTMLInputElement).disabled = true;
        (formElement.querySelector('button') as HTMLButtonElement).disabled = true;
    }

    async createCar(e: Event) {
        e.preventDefault();
        const formElement = e.currentTarget as HTMLFormElement;
        await fetch(`${this.baseLink}/garage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(new FormData(formElement))),
        });
        this.getGarage();
        formElement.reset();
    }

    switchPagesEvent(e: Event) {
        const currentTarget = <HTMLElement>e.currentTarget;
        const target = <HTMLElement>e.target;
        const targetOption: string = target.getAttribute('data-switch')!;
        if (targetOption !== (currentTarget.getAttribute('data-switch') as string)) {
            currentTarget.setAttribute('data-switch', targetOption);
            document.querySelector('#garage')!.classList.toggle('none');
            document.querySelector('#winners')!.classList.toggle('none');
        }
    }
}

export default Loader;
