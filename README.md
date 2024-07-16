# Pokemon Calc

Live Demo => [xuhaojun.github.io/pokemon-calc](https://xuhaojun.github.io/pokemon-calc/)

Welcome to Pokemon Calc! This project is an open-source web application that provides type calculations (to determine strengths and weaknesses), a Pokédex (for searching and viewing Pokémon details), and more. The source code is available on GitHub for anyone to contribute to or modify.

Pokédex data is from [PokéAPI](https://pokeapi.co/).

Inspired by [Pokemon Types with Heat Map](https://plotapi.com/docs/pokemon-types-with-heatmap/), [Pokémon Type Calculator](https://www.pkmn.help/more/), [TradingView Stock Heatmap](https://www.tradingview.com/heatmap/stock/).

## Features

- **Type Calculations**: Determine the strengths and weaknesses of Pokémon types against each other.
- **Pokédex**: Search for Pokémon and view detailed information about them, including stats, abilities, evolutions, and more.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Multilingual**: en, zh-Hant, zh-Hans, ja, ko

## Technologies Used

nodejs, static website

- **Framework**: [Next.js (SSG)](https://nextjs.org/)
- **UI**: [shadcn](https://shadcn.dev/) and [D3.js](https://d3js.org/)
- **Locales**: [lingui](https://lingui.dev/)

Setup Next.js SSG work with Github page,actions by [gregrickaby/nextjs-github-pages](https://github.com/gregrickaby/nextjs-github-pages)

## Development

- nodejs: 20(lts/iron)
- pnpm: 9

```bash
pnpm install
## next.js dev
npm run dev
```

## Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**.
2. **Create a new branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**.
4. **Commit your changes**:

   ```bash
   git commit -m 'Add some feature'
   ```

5. **Push to the branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**.

### Adding Locales

To add translations:

1. Navigate to the `src/locales/` directory.
2. Add or update the `.po` files for the language you are contributing to.
3. Follow the standard steps above to commit and push your changes.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feel free to reach out:

- **Email**: <xuhaojuntw@gmail.com>
- **GitHub**: [XuHaoJun](https://github.com/xuhaojun)
