<p align="center">
  <a href="https://www.adp.com/">
    <img src="https://1000logos.net/wp-content/uploads/2021/04/ADP-Logo-1958.jpg" width="318px" alt="ADP logo" />
  </a>
</p>

<h3 align="center">ADP Front-End Assessment - Network Team.</h3>
<p align="center">This project was built with the purpose of creating a mock feature of listing and displaying users.</p>
<p align="center"><a href="./CHANGELOG.md">CHANGELOG</a> · <a href="./LLMs.md">LLMs Transcript</a></p>

<p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<br>
Main functionalities include:

1. Continuous Integration workflow for a standardized codebase, following typechecking, linting, building best practices.
2. Atomic Design components architecture, separating components by its size and concerns.
3. Dealing with API requests [Optimistically with React Hooks](https://react.dev/reference/react/useOptimistic)
4. Expand all / collapse all buttons for displaying users information easily
5. Autocomplete component with search algorithm and `Load More` functionality, simulating a paginated API

## Getting Started

### Installation
To install and execute the project properly, the main requisites are:

* Git
* Node v24+

With them installed, follow the steps below:

1. Clone the project
```
git clone https://github.com/HenriqueCosta05/ADP-Coding-Assessment
cd ./ADP-Coding-Assessment
```

2. Install dependencies with NPM:
```
npm install
```

3. Run the project:
```
npm run dev
```

## Docker

This project doesn't ship Docker infrastructure due to the low complexity of the requirements and business rules. 

## Project Observations and Points of Attention

1. As required from the project scope, Generative AI was used and all information related to it, such as prompts and its responses has been written in [LLMs file](./LLMs.md)

2. The Users API link provided was not working (noted on September 30, 2026). Steps I've done while the API was DOWN:
- A DNS flush (`ipconfig /flushdns`) and other network troubleshooting steps were done from the development machine, without any success.
- Until it is fixed, `useUsers` falls back to the mock values in `src/mocks/users.ts`, and the page shows a "Showing sample data" notice with a "Try again" button.

3. The AI Quality Gate was a pattern that I've copied from older projects, so I didn't mention any prompt in LLMs file for this CI and Linting part of the project.