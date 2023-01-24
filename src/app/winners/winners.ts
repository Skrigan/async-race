import { winners, garage } from '../types';

class Winners {
    draw(winnersData: Array<winners>, garageData: Array<garage>) {
        const fragment = document.createDocumentFragment();
        const winnerTemplate = document.querySelector('#winnerTemplate') as HTMLTemplateElement;
        winnersData.forEach((winner) => {
            const car: garage = garageData.find((item) => item.id === winner.id)!;
            const winnerClone = winnerTemplate.content.cloneNode(true) as HTMLElement;
            winnerClone.querySelector('#winnerId')!.textContent = `${winner.id}`;
            (winnerClone.querySelector('#winnerImg') as SVGElement).style.fill = `${car.color}`;
            winnerClone.querySelector('#winnerName')!.textContent = `${car.name}`;
            winnerClone.querySelector('#winnerWins')!.textContent = `${winner.wins}`;
            winnerClone.querySelector('#winnerTime')!.textContent = `${winner.time}`;
            fragment.append(winnerClone);
        });
        document.querySelector('#winners-count')!.textContent = `${winnersData.length}`;
        document.querySelector('.winners-table__tbody')!.innerHTML = '';
        document.querySelector('.winners-table__tbody')!.appendChild(fragment);
    }
}

export default Winners;
