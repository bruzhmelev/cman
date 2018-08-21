# Известные проблемы

## Object.keys(hero.stats).map возвращает лишний ключ
Как будто что-то появляется во время выполнения

## Выключен tslint

```
{
  "rules":{
  }
}
```

Вместо
```
{
  "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
  "linterOptions": {
    "exclude": [
      "config/**/*.js",
      "node_modules/**/*.ts",
      "coverage/lcov-report/*.js"
    ]
  }
}
```

## В Controller 

Вместо 
```
        this._updateModel();
        this.template.render();
```
для реакта делать setState({...model});


## Вынести инициализацию контроллеров из render

Чтобы не при перерендере не терялся стейт