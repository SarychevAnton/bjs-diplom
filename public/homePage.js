'use strict'

// Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success === true) location.reload();
    })
}

//Получение информации о пользователе
ApiConnector.current((response) => {
    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
    }
  });

  //Получение текущих курсов валюты
    const ratesBoard = new RatesBoard();
    function currencyRates(ratesBoard) {
    ApiConnector.getStocks((response) => {
      if (response.success === true) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
      }
      });
    }
currencyRates(ratesBoard);
setInterval(currencyRates, 60000, ratesBoard);

// пополнеие счета
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, (response) => {
      if (response.success === true) {
        ProfileWidget.showProfile(response.data);
        this.setMessage(response.isSuccess, 'Успешное поплнение счета');
      } else {
        this.setMessage(!response.isSuccess, response.error);
      }
    });
  };

  // конвертация валют
  moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (response) => {
      if (response.success === true) {
        ProfileWidget.showProfile(response.data);
        this.setMessage(response.isSuccess, 'Успешная конвертация');
      } else {
        this.setMessage(!response.isSuccess, response.error);
      }
    });
  };

  //Перевод средств
  moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (response) => {
      if (response.success === true) {
        ProfileWidget.showProfile(response.data);
        this.setMessage(response.isSuccess, 'Перевод выполнен успешно');
      } else {
        this.setMessage(!response.isSuccess, response.error);
      }
    });
  };

  //Работа с избранным
  const favoritesWidget = new FavoritesWidget();
  //Начальный список
  ApiConnector.getFavorites(response => {
    if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

//Добавление в избранное
favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.isSuccess, 'Пользователь успешно добавлен в список избранных');
        } else {
            favoritesWidget.setMessage(!response.isSuccess, response.error);
        }
    });
}

//Удаление из избранного
favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.isSuccess, 'Пользователь успешно удален из списока избранных');
        } else {
            favoritesWidget.setMessage(!response.isSuccess, response.error);
        }
    });
}