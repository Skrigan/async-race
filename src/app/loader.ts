import { garage, winners } from './types';
import Garage from './garage/garage';
import Winners from './winners/winners';
import Utils from './utils';
import Requests from './requests';
import json from './layout.json';

class Loader {
    garageList: Array<garage> = [];
    winnersList: Array<winners> = [];
    garage: Garage;
    winners: Winners;
    utils: Utils;
    requests: Requests;

    constructor(public baseLink: string) {
        this.garage = new Garage();
        this.winners = new Winners()
        this.requests = new Requests();
        this.utils = new Utils();
        this.renderHtml(json.html);
        this.setGarage(1);
        this.setWinners(1);
        (document.querySelector('.header') as HTMLElement).addEventListener('click', (e) => this.switchPagesEvent(e));
        (document.querySelector('.form_create') as HTMLFormElement).addEventListener('submit', (e) =>
            this.createCar(e),
        );
        (document.querySelector('.form_update') as HTMLFormElement).addEventListener('submit', (e) =>
            this.updateCar(e),
        );
        (document.querySelector('#garageList') as HTMLElement).addEventListener('click', (e) => this.carButtons(e));
        (document.querySelector('.garage-pagination') as HTMLElement).addEventListener('click', (e) =>
            this.garagePagination(e),
        );
        (document.querySelector('.winner-pagination') as HTMLElement).addEventListener('click', (e) =>
            this.winnerPagination(e),
        );
        (document.querySelector('#generateCars') as HTMLElement).addEventListener('click', () => this.createHundredCars());
        (document.querySelector('.winners-table__thead') as HTMLElement).addEventListener('click', (e) =>
            this.sortWinnersEvent(e),
        );
    }

    renderHtml(html: string) {
        document.body.innerHTML = html;
    }

    sortWinnersEvent(e: Event): void {
        const target = e.target as HTMLElement;
        if (target.id === 'sortByWins') {
            this.sortWinners('wins', target);
        } else if (target.id === 'sortByTime') {
            this.sortWinners('time', target);
        }
    }

    sortWinners(sortBy: string, target: HTMLElement): void {
        const sortingType: string = target.getAttribute(`data-${sortBy}Sort`)!;
        switch (sortingType) {
            case '':
                target.setAttribute(`data-${sortBy}Sort`, 'ASC');
                this.setWinners(Number(document.querySelector('#winners-page-number')!.textContent), sortBy, 'ASC');
                break;
            case 'ASC':
                target.setAttribute(`data-${sortBy}Sort`, 'DESC');
                this.setWinners(
                    Number(document.querySelector('#winners-page-number')!.textContent),
                    sortBy,
                    'DESC',
                );
                break;
            case 'DESC':
                target.setAttribute(`data-${sortBy}Sort`, 'ASC');
                this.setWinners(Number(document.querySelector('#winners-page-number')!.textContent), sortBy, 'ASC');
                break;
            default:
        }
    }

    createHundredCars(): void {
        this.utils.generateCars().forEach((car) => this.requests.createCar(car, this.baseLink));
        this.setGarage();
    }

    carButtons(e: Event): void {
        const target = e.target as HTMLElement;
        const carId = Number(target.closest('.car')!.getAttribute('data-carId'));
        if (target.classList.contains('button_remove')) {
            this.removeCar(carId);
        } else if (target.classList.contains('button_select')) {
            this.selectCar(carId);
        }
    }

    async removeCar(carId: number): Promise<void> {
        if ((await this.requests.deleteCar(carId, this.baseLink)).ok) {
            const currentPage = Number(document.querySelector('#winners-page-number')!.textContent);
            const winnersCount: number = document.querySelector('.winners-table__tbody')!.children.length;
            if (winnersCount === 1 && currentPage > 1) this.setWinners(currentPage - 1);
            else this.setWinners(currentPage);
        }
        const currentPage = Number(document.querySelector('#garage-page-number')!.textContent);
        const carCount: number = document.querySelector('#garageList')!.children.length;
        if (carCount === 1 && currentPage > 1) this.setGarage(currentPage - 1);
        else this.setGarage(currentPage);
    }

    selectCar(carId: number): void {
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


    garagePagination(e: Event): void {
        const currentPage = Number(document.querySelector('#garage-page-number')!.textContent);
        const target = e.target as HTMLButtonElement;
        if (target.id === 'next-garage') this.setGarage(currentPage + 1);
        else if (target.id === 'prev-garage') this.setGarage(currentPage - 1);
    }

    winnerPagination(e: Event): void {
        const currentPage = Number(document.querySelector('#winners-page-number')!.textContent);
        const target = e.target as HTMLButtonElement;
        if (target.id === 'next-winner') this.setWinners(currentPage + 1);
        else if (target.id === 'prev-winner') this.setWinners(currentPage - 1);
    }

    async setGarage(newPage = Number(document.querySelector('#garage-page-number')!.textContent)): Promise<void> {
        document.querySelector('#garage-page-number')!.textContent = `${newPage}`;
        const res = await this.requests.getGaragePage(this.baseLink, newPage);
        const length = Number(res.headers.get('X-Total-Count'));
        this.garageList = await res.json();
        document.querySelector('#garage-fullness')!.textContent = `${length}`;

        if (newPage === 1) {
            (document.querySelector('#prev-garage') as HTMLButtonElement).disabled = true;
        } else (document.querySelector('#prev-garage') as HTMLButtonElement).disabled = false;
        if (7 * newPage >= length) {
            (document.querySelector('#next-garage') as HTMLButtonElement).disabled = true;
        } else (document.querySelector('#next-garage') as HTMLButtonElement).disabled = false;

        this.garage.draw(this.garageList);
    }

    async setWinners(
        newPage: number = Number(document.querySelector('#winners-page-number')!.textContent),
        sort: string = 'id',
        order: string = 'ASC',
    ): Promise<void> {
        document.querySelector('#winners-page-number')!.textContent = `${newPage}`;
        const res = await this.requests.getWinnersPage(this.baseLink, newPage, sort, order);
        const length = Number(res.headers.get('X-Total-Count'));
        this.winnersList = await res.json();
        const allGarage: Array<garage> = await this.requests.getAllGarage(this.baseLink).then((res) => res.json());
        document.querySelector('#winners-count')!.textContent = `${length}`;

        if (newPage === 1) {
            (document.querySelector('#prev-winner') as HTMLButtonElement).disabled = true;
        } else (document.querySelector('#prev-winner') as HTMLButtonElement).disabled = false;
        if (10 * newPage >= length) {
            (document.querySelector('#next-winner') as HTMLButtonElement).disabled = true;
        } else (document.querySelector('#next-winner') as HTMLButtonElement).disabled = false;

        this.winners.draw(this.winnersList, allGarage);
    }

    updateCar(e: Event): void {
        e.preventDefault();
        const formElement = e.currentTarget as HTMLFormElement;
        const car = Object.fromEntries(new FormData(formElement));
        this.requests.updateCar(this.baseLink, car);
        this.setGarage();
        this.setWinners();
        formElement.reset();
        (formElement.querySelector('.input_text') as HTMLInputElement).disabled = true;
        (formElement.querySelector('.input_color') as HTMLInputElement).disabled = true;
        (formElement.querySelector('button') as HTMLButtonElement).disabled = true;
    }

    createCar(e: Event): void {
        e.preventDefault();
        const formElement = e.currentTarget as HTMLFormElement;
        const car: { name?: string; color?: string } = Object.fromEntries(new FormData(formElement));
        this.requests.createCar(car, this.baseLink);
        this.setGarage();
        formElement.reset();
    }

    switchPagesEvent(e: Event): void {
        const currentTarget = <HTMLElement>e.currentTarget;
        const target = <HTMLElement>e.target;
        if (target.classList.contains('button')) {
            const garageButton = currentTarget.querySelector('#on-garage') as HTMLButtonElement;
            const winnersButton = currentTarget.querySelector('#on-winners') as HTMLButtonElement;
            garageButton.disabled = !garageButton.disabled;
            winnersButton.disabled = !winnersButton.disabled;
            document.querySelector('#garage')!.classList.toggle('none');
            document.querySelector('#winners')!.classList.toggle('none');
        }
    }
}

export default Loader;
