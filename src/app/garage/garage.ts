import { garage } from '../types';

class Garage {
	draw(garageData: Array<garage>) {
		const fragment = document.createDocumentFragment();
		const carTemplate = document.querySelector('#carTemplate') as HTMLTemplateElement;
		console.log('carsData =', garageData)
		garageData.forEach((car) => {
			const carClone = carTemplate.content.cloneNode(true) as HTMLElement;
			// console.log(carClone.querySelector('.car'));
			(carClone.querySelector('.car__img') as SVGElement).style.fill = car.color;
			carClone.querySelector('.car__title')!.textContent = car.name;
			carClone.querySelector('.car')!.setAttribute('data-carId', `${car.id}`);
			fragment.append(carClone);
		})
		document.querySelector('#garage-fullness')!.textContent = `${garageData.length}`;
		document.querySelector('#garageList')!.innerHTML = '';
		document.querySelector('#garageList')!.appendChild(fragment);
	}
}

export default Garage;