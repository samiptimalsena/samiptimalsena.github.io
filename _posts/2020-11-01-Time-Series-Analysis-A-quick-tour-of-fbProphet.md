---
title:  "Time Series Analysis — A quick tour of fbProphet"
date:   2020-11-01 08-00-00 
classes: wide
permalink: "/time-series-in-fbprophet/"
excerpt: "The series of data points plotted against time is known as time series. It is a de-facto analysis technique used in market evaluation and in weather forecast."
---

The series of data points plotted against time is known as time series. It is a de-facto analysis technique used in market evaluation and in weather forecast. It is an exciting topic to study as it somehow tends to predict the future, which we are always interested in.

There are two types of Machine Learning(ML) models that are used for time series analysis:
1. Temporal Dependence Model
2. General Additive Model (GAM)

## Temporal Dependence Model

We can make forecast of tomorrow’s weather by observing the weather of past few days. If the weather was sunny for last 4–5 days then there is high chance for weather to be sunny tomorrow. This is an intuitive way of understanding temporal dependence model. The correlation between past and present values shows temporal dependence. In this model, we give heavy weights to recent data than the older data points. Some examples of this type of model are ARIMA (Autoregressive Integrated Moving Average), SARIMA (Seasonal Autoregressive Integrated Moving Average), LSTM(Long Short Term Memory).

ARIMA requires data to have constant mean and variance with no seasonality. If data doesn’t satisfy the above conditions, lets say, if we have a data points that has a upward trend, then to use ARIMA we first need to apply transformation on it, and make it stationary. LSTM, on other hand, is a powerful recurrent neural network. The prediction of LSTM is highly accurate but what component of network lead for the prediction remains unknown as neural networks lacks interpretability.

## General Additive Model (GAM)

Instead of using correlation between values from similar time stamps, we can train our model on overall trends and add some seasonal effect to it. The principle behind GAM is similar to that of regression model. Unlike regression which uses individual predictor for outcome, GAM uses sum of smooth function to predict the outcome. The smooth functions here includes functions describing trend component, seasonal component, holiday component and so on. As GAM comprises of functions, we can isolate the individual function and evaluate its effect in prediction, which makes GAM more interpretable. An example of GAM is fbProphet.

### fbProphet

FbProphet is a powerful time series analysis package released by Core Data Science Team at Facebook. It is simple and easy to go package for performing time series analytics and forecasting at scale.

According to official [prophet’s website](https://facebook.github.io/prophet/):

*"Prophet is a procedure for forecasting time series data based on an additive model where non-linear trends are fit with yearly, weekly, and daily seasonality, plus holiday effects. It works best with time series that have strong seasonal effects and several seasons of historical data. Prophet is robust to missing data and shifts in the trend, and typically handles outliers well."*

An analyst with no training expertise in time series can tweaks few interpretable parameters and obtain a good forecasting model in Prophet.

The data science team at Facebook found that by combining automatic forecasting with analyst-in-the-loop forecasts for special cases, it is possible to cover a wide variety of business use-cases. The following diagram illustrates the forecasting process used in prophet:

![Analyst_in_the_loop](/assets/images/Time_series_fbprophet/img_1.png)

Prophet uses a decomposable time series model with three main model components: trend, seasonality, and holidays. They are combined in the following equation:

**y(t) = g(t) + s(t) + h(t) + e(t)**

Here,
- **g(t)** is a trend function which models the non-periodic changes. It can be either a linear function or a logistic function.
- **s(t)** represents a periodic changes i.e weekly, monthly, yearly. An yearly seasonal component is modeled using Fourier series and weekly seasonal component using dummy variables.
- **h(t)** is a function that represents the effect of holidays which occur on irregular schedules.(n≥1 days)
- The term **e(t)** represents error changes that are not accommodated by the model.

The research paper for prophet can be found [here](https://peerj.com/preprints/3190.pdf#section.1).

## Installation
Prophet is available in both Python and R. This story covers python installation and implementation of Prophet.

Prophet can be installed using pip in Python as shown below. Prophet depends on a Python module called *pystan*. This module will be installed automatically as we install Prophet.

```bash
$ pip install fbprophet
```

## Example

Since prophet works best with seasonal data, here i have used simple data with yearly seasonality.

Lets import necessary library along with fb prophet and read the dataset.

![IMG](/assets/images/Time_series_fbprophet/img_2.png)

Though prophet can handle missing values, it’s good to remove the NaN values. The data set has only one missing values. The row with missing value is dropped and the Month column is converted to datetime types.

![IMG](/assets/images/Time_series_fbprophet/img_3.png)

Prophet requires the proper name convention for the columns of the dataset. So, the columns are renamed to ds and y as required by prophet. Now, lets visualize the dataset.

![IMG](/assets/images/Time_series_fbprophet/img_4.png)

The dataset is splitted into training and testing set. A prophet model is instantiated with yearly seasonality and fitted on the training dataset.

![IMG](/assets/images/Time_series_fbprophet/img_5.png)

Now, a dataframe having 68 months(test data count) is created using *make_future_dataframe()* function of prophet and the model makes forecast in this dataframe.

![IMG](/assets/images/Time_series_fbprophet/img_6.png)

If we compare the above graph with the actual data, they both seems to be pretty similar to each other. Hence the model is working well.

Fbprophet provides a *plot_component()* function that can be used to visualize the overall trend and components of the time series.

![IMG](/assets/images/Time_series_fbprophet/img_7.png)

I believe I was able to provide a good description of time series analysis and ML models for performing analysis and forecast with a short demo of powerful prophet package. If you wish to see how to perform time series analytics on non-periodic data using prophet, give a visit to my [repo](https://github.com/samiptimalsena/Time_Series_Analysis). The repo also includes the implementation of ARIMA model.
