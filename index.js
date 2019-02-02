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
	
	// We are returning an object which will have a way to get the state, listen to the changes in state
	return {
		getState,
		subscribe
	}
}