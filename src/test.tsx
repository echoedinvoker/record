function Parent() {
  function scrollDown() {
  }

  return (
    <>
      <button onClick={scrollDown}>Scroll Down</button>
      <Middle />
    </>
  );
}

function Middle() {
  return (
    <>
      <Child />
    </>
  );
}

function Child() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em', height: '70vh', overflow: 'auto' }}>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
      <p>TEST</p>
    </div>
  );
}

