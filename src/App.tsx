import * as React from 'react';
import './App.css';
import logo from './logo.svg';

import { Controller } from './ui/Controller';
import { RController } from './ui/RController';
import { stages } from './content/entities/stages';


class App extends React.Component {
  

  public render() {
    const jsviewController = new Controller();
    jsviewController.run();
    jsviewController.render();

    const reactController = new RController();
    let {
      stats, 
      roads, 
      locations, 
      events, 
      hero
    } = reactController.run();

    console.log('App', 'render')

    return (
      <div className="host2 wide2">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
            Время: <span className={hero.late?'attention':''}>{hero.time}</span> |
            Деньги: {hero.score} |
            {Object.keys(hero.stats).map((statName) => <span>{stats[statName].title}: {hero.stats[statName]} &nbsp;</span>)}
            Раунд: {hero.round} |
            Поездка: {hero.trip}
            {(locations[hero.targetId]) ? (<span>| Цель: {locations[hero.targetId].title}</span>) : null}
        </div>
        <hr />
        <div id="tasks">
          <div className="title">Мои заказы</div>
          <table className={hero.tasks.length?'visible':'hidden'}>
            {hero.tasks.map((task: any) => {
              return (
                <tr>
                  <td>{locations[task.targetId].title}</td>
                  <td className="rigth">{task.price} руб.</td>
                  <td>{task.status}</td>
                </tr>
              );
            })}
          </table>
        </div>
        <hr />
        <div id="init" className={hero.stageId=='init'?'visible':'hidden'}>
            <div className="title">{stages[hero.stageId].title}</div>
            <div>Распрелите очки между характеристиками. Осталось: <span>{hero.points}</span></div>
            <table>
              {Object.keys(hero.stats).map((statName) => {
                const statValue = hero.stats[statName];
                return (
                  <tr>
                      <td>{stats[statName].title}</td>
                      <td className="rigth">{statValue}</td>
                      <td><span className="button" onClick={() => {reactController.allocatePoint(statName); this.setState({})}}>+</span></td>
                  </tr>
                );
              })}
                <tr data-each="statValue,statName in hero.stats">
                    <td><span data-text="{stats[statName].title}"></span></td>
                    <td className="rigth"><span data-text="{statValue}"></span></td>
                    <td><span className="button" data-on-click="allocatePoint(statName)">+</span></td>
                </tr>
            </table>
        </div>
        <div id="home" data-at-class="{hero.stageId=='home'?'visible':'hidden'}">
            <div className="title" data-text="{stages[hero.stageId].title}"></div>
            <div data-at-class="button {hero.points?'visible':'hidden'}" data-on-click="rest()">Отдохнуть</div>
            <div className="button" data-on-click="startOrders()">Взять заказы</div>
        </div>
        <div id="orders" data-at-class="{hero.stageId=='orders'?'visible':'hidden'}">
            <div className="panel1">
                <div className="title" data-text="{stages[hero.stageId].title}"></div>
                <table data-at-class="{orders?'visible':'hidden'}">
                    <tr data-each="order,orderIndex in orders">
                        <td><span data-text="{order.text}"></span></td>
                        <td><span data-text="{locations[order.targetId].title}"></span></td>
                        <td className="rigth"><span data-text="{order.price}"></span> руб.</td>
                        <td><span className="button" data-on-click="addOrder(orderIndex)">Выбрать</span></td>
                    </tr>
                </table>
                <div className="button" data-on-click="finishOrders()">Готово</div>
            </div>
            <div className="panel2">
                <table>
                    <tr data-each="road in roads">
                        <td><span data-text="{locations[road.sourceId].title}"></span></td>
                        <td><span data-text="{locations[road.targetId].title}"></span></td>
                        <td className="rigth"><span data-text="{road.duration}"></span> мин.</td>
                    </tr>
                </table>
            </div>
        </div>
        <div id="map" data-at-class="{hero.stageId=='map'?'visible':'hidden'}">
            <div className="panel1">
                <div className="title" data-text="{stages[hero.stageId].title}"></div>
                <div className="button" data-on-click="goHome()">Домой</div>
                <table data-at-class="{routes.length?'visible':'hidden'}">
                    <tr data-each="route in routes">
                        <td><span data-text="{locations[route.sourceId].title}"></span></td>
                        <td><span data-text="{locations[route.targetId].title}"></span></td>
                        <td className="rigth"><span data-text="{route.duration}"></span> мин.</td>
                        <td><span data-at-class="button" data-on-click="startTrip(route.roadId)">Выбрать</span></td>
                    </tr>
                </table>
            </div>
            <div className="panel2">
                <table>
                    <tr data-each="road in roads">
                        <td><span data-text="{locations[road.sourceId].title}"></span></td>
                        <td><span data-text="{locations[road.targetId].title}"></span></td>
                        <td className="rigth"><span data-text="{road.duration}"></span> мин.</td>
                    </tr>
                </table>
            </div>
        </div>
        <div id="event" data-at-class="{hero.eventIndex==null?'hidden':'visible'}" data-using="event:events[hero.eventIndex]">
            <div className="title" data-text="{stages[hero.stageId].title}"></div>
            <div data-text="{event.text}"></div>
            <div data-each="choice,choiceIndex in event.choices">
                <div data-at-class="button {hero.choiceIndex==choiceIndex?'selected':''}" data-text="{choice.text}" data-on-click="makeChoice(choiceIndex)"></div>
            </div>
            <hr />
        </div>
        <div id="outcome" data-at-class="{hero.outcomeIndex==null?'hidden':'visible'}" data-using="event:events[hero.eventIndex];choice:event.choices[hero.choiceIndex];outcome:choice.outcomes[hero.outcomeIndex]">
            <div data-text="{outcome.text}"></div>
            <div className="button" data-on-click="nextEvent()">Дальше</div>
        </div>
      </div>
    );
  }
}

export default App;
