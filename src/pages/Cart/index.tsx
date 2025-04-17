import { Fragment, useState } from 'react'
import {
  Bank,
  CreditCard,
  CurrencyDollar,
  Money,
  Trash,
} from '@phosphor-icons/react'

import {
  CartTotal,
  CartTotalInfo,
  CheckoutButton,
  Coffee,
  CoffeeInfo,
  Container,
  InfoContainer,
  PaymentContainer,
  PaymentErrorMessage,
  PaymentHeading,
  PaymentOptions,
} from './styles'
import { Tags } from '../../components/CoffeeCard/styles'
import { QuantityInput } from '../../components/Form/QuantityInput'
import { Radio } from '../../components/Form/Radio'

export interface Item {
  id: string
  quantity: number
}
export interface Order {
  id: number
  items: CoffeeInCart[]
}

interface CoffeeInCart {
  id: string
  title: string
  description: string
  tags: string[]
  price: number
  image: string
  quantity: number
  subTotal: number
  paymentMethod: 'credit' | 'debit' | 'cash'
}

const DELIVERY_PRICE = 3.75

export function Cart() {
  const [coffeesInCart, setCoffeesInCart] = useState<CoffeeInCart[]>([
    {
      id: '0',
      title: 'Expresso Tradicional',
      description: 'O tradicional café feito com água quente e grãos moídos',
      tags: ['tradicional', 'gelado'],
      price: 6.9,
      image: '/images/coffees/expresso.png',
      quantity: 1,
      subTotal: 6.9,
      paymentMethod: 'credit',
    },
    {
      id: '1',
      title: 'Expresso Americano',
      description: 'Expresso diluído, menos intenso que o tradicional',
      tags: ['tradicional', 'com leite'],
      price: 9.95,
      image: '/images/coffees/americano.png',
      quantity: 2,
      subTotal: 19.9,
      paymentMethod: 'cash',
    },
    {
      id: '2',
      title: 'Expresso Cremoso',
      description: 'Café expresso tradicional com espuma cremosa',
      tags: ['especial'],
      price: 16.5,
      image: '/images/coffees/expresso-cremoso.png',
      quantity: 3,
      subTotal: 49.5,
      paymentMethod: 'debit',
    },
  ])

  const amountTags: string[] = []
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'cash'>('credit')

  coffeesInCart.forEach((coffee) =>
    coffee.tags.forEach((tag) => {
      if (!amountTags.includes(tag)) {
        amountTags.push(tag)
      }
    }),
  )

  const totalItemsPrice = coffeesInCart.reduce((currencyValue, coffee) => {
    return currencyValue + coffee.price * coffee.quantity
  }, 0)

  function handleItemIncrement(id: string) {
    setCoffeesInCart((prevState) =>
      prevState.map((coffee) => {
        if (coffee.id === id) {
          const coffeeQuantity = coffee.quantity + 1
          const subTotal = coffee.price * coffeeQuantity
          return {
            ...coffee,
            quantity: coffeeQuantity,
            subTotal,
          }
        }
        return coffee
      }),
    )
  }

  function handleItemDecrement(itemId: string) {
    setCoffeesInCart((prevState) =>
      prevState.map((coffee) => {
        if (coffee.id === itemId && coffee.quantity > 1) {
          const coffeeQuantity = coffee.quantity - 1
          const subTotal = coffee.price * coffeeQuantity
          return {
            ...coffee,
            quantity: coffeeQuantity,
            subTotal,
          }
        }
        return coffee
      }),
    )
  }

  function handleItemRemove(itemId: string) {
    setCoffeesInCart((prevState) =>
      prevState.filter((coffee) => coffee.id !== itemId),
    )
  }

  function getTotalWithPaymentAdjustment(
    total: number,
    method: 'credit' | 'debit' | 'cash',
  ): number {
    switch (method) {
      case 'credit':
        return total * 1.0385
      case 'debit':
        return total * 1.85
      default:
        return total // cash/pix
    }
  }

  const totalItemsPriceWithPaymentAdjustment = getTotalWithPaymentAdjustment(
    totalItemsPrice,
    paymentMethod,
  )

  return (
    <Container>
      <InfoContainer>
        <PaymentContainer>
          <PaymentHeading>
            <CurrencyDollar size={22} />
            <div>
              <span>Pagamento</span>
              <p>O pagamento é feito na entrega. Escolha a forma que deseja pagar</p>
            </div>
          </PaymentHeading>

          <PaymentOptions>
            <div>
              <Radio
                isSelected={paymentMethod === 'credit'}
                onClick={() => setPaymentMethod('credit')}
                value="credit"
              >
                <CreditCard size={16} />
                <span>Cartão de crédito</span>
              </Radio>

              <Radio
                isSelected={paymentMethod === 'debit'}
                onClick={() => setPaymentMethod('debit')}
                value="debit"
              >
                <Bank size={16} />
                <span>Cartão de débito</span>
              </Radio>

              <Radio
                isSelected={paymentMethod === 'cash'}
                onClick={() => setPaymentMethod('cash')}
                value="cash"
              >
                <Money size={16} />
                <span>Pix ou Dinheiro</span>
              </Radio>
            </div>

          </PaymentOptions>
        </PaymentContainer>
      </InfoContainer>

      <InfoContainer>
        <h2>Cafés selecionados</h2>

        <CartTotal>
          {coffeesInCart.map((coffee) => (
            <Fragment key={coffee.id}>
              <Coffee>
                <div>
                  <img src={coffee.image} alt={coffee.title} />

                  <div>
                    <span>{coffee.title}</span>
                    <Tags>
                      {coffee.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </Tags>

                    <CoffeeInfo>
                      <QuantityInput
                        quantity={coffee.quantity}
                        incrementQuantity={() => handleItemIncrement(coffee.id)}
                        decrementQuantity={() => handleItemDecrement(coffee.id)}
                      />

                      <button onClick={() => handleItemRemove(coffee.id)}>
                        <Trash />
                        <span>Remover</span>
                      </button>
                    </CoffeeInfo>
                  </div>
                </div>

                <aside>R$ {coffee.subTotal?.toFixed(2)}</aside>
              </Coffee>

              <span />
            </Fragment>
          ))}

          <CartTotalInfo>
            <div>
              <span>Total de itens</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(totalItemsPriceWithPaymentAdjustment)}
              </span>
            </div>

            <div>
              <span>Entrega</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(DELIVERY_PRICE * amountTags.length)}
              </span>
            </div>

            <div>
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(
                  totalItemsPriceWithPaymentAdjustment +
                    DELIVERY_PRICE * amountTags.length,
                )}
              </span>
            </div>
          </CartTotalInfo>

          <CheckoutButton type="submit" form="order">
            Confirmar pedido
          </CheckoutButton>
        </CartTotal>
      </InfoContainer>
    </Container>
  )
}
