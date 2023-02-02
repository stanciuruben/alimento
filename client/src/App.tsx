import UserInputs from './components/UserInputs';

function App (): JSX.Element {
  return (
    <div className="App">
      <h1>Welcome To Alimento</h1>
      <img src="/pan.svg" alt="pan with 2 eggs" />
      <UserInputs />
    </div>
  )
}

export default App
