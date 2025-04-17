import { Coffee, Package, ShoppingCart, Timer } from '@phosphor-icons/react'
import { useTheme } from 'styled-components'

import { CoffeeCard } from '../../components/CoffeeCard'

import { CoffeeList, Heading, Hero, HeroContent, Info, Navbar } from './styles'
import { useEffect, useState } from 'react';
import { Radio } from '../../components/Form/Radio';
import { api } from '../../serves/api';

interface Coffee {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  image: string;
  quantity: number;
  favorite: boolean;
};

export function Home() {
  const theme = useTheme();
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [filteredCoffees, setFilteredCoffees] = useState<Coffee[]>([]);

  useEffect(() => {
    async function fetchCoffees() {
      const response = await api('/coffees');
      const sortedCoffees = response.data.sort((a: Coffee, b: Coffee) => a.title.localeCompare(b.title));
      setCoffees(sortedCoffees);
      setFilteredCoffees(sortedCoffees);
    }
    fetchCoffees();
  }, []);

  function incrementQuantity(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id ? { ...coffee, quantity: coffee.quantity + 1 } : coffee
      )
    );
    setFilteredCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id ? { ...coffee, quantity: coffee.quantity + 1 } : coffee
      )
    );
  }

  function decrementQuantity(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id && coffee.quantity > 0 ? { ...coffee, quantity: coffee.quantity - 1 } : coffee
      )
    );
    setFilteredCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id && coffee.quantity > 0 ? { ...coffee, quantity: coffee.quantity - 1 } : coffee
      )
    );
  }

  function handleFavoriteCoffee(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id ? { ...coffee, favorite: !coffee.favorite } : coffee
      )
    );
    setFilteredCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id ? { ...coffee, favorite: !coffee.favorite } : coffee
      )
    );
  }

  function handleCategoryFilter(tag: string) {
    const filtered = coffees.filter((coffee) => coffee.tags.includes(tag));
    setFilteredCoffees(filtered);
  }

  return (
    <div>
      <Hero>
        <HeroContent>
          <div>
            <Heading>
              <h1>Encontre o café perfeito para qualquer hora do dia</h1>
              <span>
                Com o Coffee Delivery você recebe seu café onde estiver, a
                qualquer hora
              </span>
            </Heading>

            <Info>
              <div>
                <ShoppingCart
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['yellow-dark'] }}
                />
                <span>Compra simples e segura</span>
              </div>

              <div>
                <Package
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['base-text'] }}
                />
                <span>Embalagem mantém o café intacto</span>
              </div>

              <div>
                <Timer
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.yellow }}
                />
                <span>Entrega rápida e rastreada</span>
              </div>

              <div>
                <Coffee
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.purple }}
                />
                <span>O café chega fresquinho até você</span>
              </div>
            </Info>
          </div>

          <img src="/images/hero.svg" alt="Café do Coffee Delivery" />
        </HeroContent>

        <img src="/images/hero-bg.svg" id="hero-bg" alt="" />
      </Hero>

      <CoffeeList>
        <h2>Nossos cafés</h2>

        <Navbar>
          <Radio
            onClick={() => handleCategoryFilter("tradicional")}
            isSelected={false}
            value="tradicional"
          >
            <span>Tradicional</span>
          </Radio>

          <Radio
            onClick={() => handleCategoryFilter("gelado")}
            isSelected={false}
            value="gelado"
          >
            <span>Gelado</span>
          </Radio>

          <Radio
            onClick={() => handleCategoryFilter("com leite")}
            isSelected={false}
            value="com leite"
          >
            <span>Com leite</span>
          </Radio>
        </Navbar>

        <div>
          {filteredCoffees.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              handleFavoriteCoffee={() => handleFavoriteCoffee(coffee.id)}
            />
          ))}
        </div>
      </CoffeeList>
    </div>
  );
}
