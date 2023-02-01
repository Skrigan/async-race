import { garage, winners } from './types';

class Requests {

	createCar(car: { name?: string; color?: string }, baseLink: string): Promise<Response> {
		return fetch(`${baseLink}/garage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(car),
		});
	};

	updateCar(baseLink: string, car: { name?: string; color?: string; id?: number }): void {
		fetch(`${baseLink}/garage/${car.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(car),
		});
	}

	deleteCar(carId: number, baseLink: string): Promise<Response> {
		fetch(`${baseLink}/garage/${carId}`, {
			method: 'DELETE',
		});
		return fetch(`${baseLink}/winners/${carId}`, {
			method: 'DELETE',
		});
	}

	getGaragePage(baseLink: string, newPage: number): Promise<Response> {
		return fetch(`${baseLink}/garage?_page=${newPage}&_limit=7`);
	}

	getWinnersPage(baseLink: string, newPage: number, sort: string, order: string): Promise<Response> {
		return fetch(`${baseLink}/winners?_page=${newPage}&_limit=10&_sort=${sort}&_order=${order}`)
	}

	getAllGarage(baseLink: string): Promise<Response> {
		return fetch(`${baseLink}/garage`);
	}

}

export default Requests;