function createStore () {
	// The store should have four parts
	// 1. The state
	// 2. Get the state.
	// 3. Listen to changes on the state.
	// 4. Update the state
	
	let state;
	
	const getState = () => state;
	
	// We are returning an object which will have a way to get the state
	return {
		getState
	}
}