function todos (action = [], reducer) {
	if(action.type === 'ADD_TODO') {
		return state.concat([action.todo]);
	}
	
	return state;
}

function createStore () {
	// The store should have four parts
	// 1. The state
	// 2. Get the state.
	// 3. Listen to changes on the state.
	// 4. Update the state
	
	let state;
	let listeners = [];
	
	const getState = () => state;
	
	const subscribe = (listener) => {
		listeners.push(listener);
		
		return () => {
			listeners.filter(l => l !== listener)
		}
	}
	
	/* 
		Responsible for updating the state inside of our actual store
		It receives the action which is the specific event that occured within the app
	*/
	const dispatch = (action) => {
		state = todos(state, action);
		
		// Loop through all of our listeners (an array of functions) and invoke each one of them
		listeners.forEach((listener) => listener());
	}
	
	// We are returning an object which will have a way to get the state, listen to the changes in state and update the state
	return {
		getState,
		subscribe,
		dispatch
	}
}