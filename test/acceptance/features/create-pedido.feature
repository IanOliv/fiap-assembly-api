
Feature: Pedido
  Scenario: Criar Pedido
    Given que sou consumidor identificado
    When criar um pedido
    Then o pedido é criado com sucesso
  
  Scenario: Criar Pedido
    Given que sou consumidor não identificado
    When criar um pedido
    Then o pedido é criado com sucesso