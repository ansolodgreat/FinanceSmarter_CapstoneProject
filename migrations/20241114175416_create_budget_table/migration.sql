-- Create Budgets Table
CREATE TABLE Budgets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL NOT NULL,
    createdBy VARCHAR(255) NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Expenses Table
CREATE TABLE Expenses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL NOT NULL,
    budgetId INT NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_budget FOREIGN KEY (budgetId) REFERENCES Budgets(id) ON DELETE CASCADE
);

-- Create Incomes Table
CREATE TABLE Incomes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL NOT NULL,
    createdBy VARCHAR(255) NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
