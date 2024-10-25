import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './pokemon-ui.css.js';
import '@bbva-web-components/bbva-button-default/bbva-button-default.js';
import '@bbva-web-components/bbva-foundations-grid-default-layout/bbva-foundations-grid-default-layout';

export class PokemonUi extends LitElement {
  static get properties() {
    return {
      pokemones: { type: Array },
    };
  }

  constructor() {
    super();
    this.pokemones = [];
  }

  static get styles() {
    return [
      styles,
      getComponentSharedStyles('pokemon-ui-shared-styles'),
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchPokemones();
  }

  async fetchPokemones() {
    const promesas = [];
    for (let i = 1; i <= 20; i++) {
      promesas.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
    }
    const datosPokemones = await Promise.all(promesas);
    this.pokemones = await Promise.all(datosPokemones.map(pokemon => this.fetchDatosBasicos(pokemon)));
  }

  async fetchDatosBasicos(pokemon) {
    return {
      nombre: pokemon.name,
      imagenUrl: pokemon.sprites.front_default,
      speciesUrl: pokemon.species.url,
      types: pokemon.types.map(typeInfo => typeInfo.type.name).join(', '),
    };
  }

  handleDetalles(pokemon) {
    const event = new CustomEvent('ver-detalles', { detail: pokemon });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <h1><center>Pokemons</center></h1>
      <bbva-foundations-grid-default-layout layout='[
        {"slot":"first","cols":{"xs":4,"sm":4,"md":4,"lg":4}},
        {"slot":"second","cols":{"xs":4,"sm":4,"md":4,"lg":4}},
        {"slot":"third","cols":{"xs":4,"sm":4,"md":4,"lg":4}},
        {"slot":"fourth","cols":{"xs":4,"sm":4,"md":4,"lg":4}},
        {"slot":"fifth","cols":{"xs":4,"sm":4,"md":4,"lg":4}},
        {"slot":"sixth","cols":{"xs":4,"sm":4,"md":4,"lg":4}}
      ]'>
        ${this.pokemones.map((pokemon, index) => html`
          <div slot="${['first', 'second', 'third', 'fourth', 'fifth', 'sixth'][index % 6]}" class="element">
            <div style="text-align: center; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
              <p>${pokemon.nombre}</p>
              <p>Tipos: ${pokemon.types}</p>
              <img src="${pokemon.imagenUrl}" alt="${pokemon.nombre}" style="width: 100px; height: 100px;">
              <bbva-button-default @click="${() => this.handleDetalles(pokemon)}" style="margin-top: 10px; width: 100%;">Ver detalles</bbva-button-default>
            </div>
          </div>
        `)}
      </bbva-foundations-grid-default-layout>
      <slot></slot>
    `;
  }
}

customElements.define('pokemon-ui', PokemonUi);
