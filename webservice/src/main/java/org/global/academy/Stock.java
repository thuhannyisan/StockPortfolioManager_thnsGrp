package org.global.academy;

public class Stock {
    private String companyName;
    private String symbol;
    private String stockExchange;
    private double currentPrice;

    // Constructor
    public Stock(String companyName, String symbol, String stockExchange, double currentPrice) {
        this.companyName = companyName;
        this.symbol = symbol;
        this.stockExchange = stockExchange;
        this.currentPrice = currentPrice;
    }

    // Getters and Setters
    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getStockExchange() {
        return stockExchange;
    }

    public void setStockExchange(String stockExchange) {
        this.stockExchange = stockExchange;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    // Method to display stock information
    public void displayInfo() {
        System.out.println("Company: " + companyName);
        System.out.println("Symbol: " + symbol);
        System.out.println("Stock Exchange: " + stockExchange);
        System.out.println("Current Price: $" + currentPrice);
    }

}
