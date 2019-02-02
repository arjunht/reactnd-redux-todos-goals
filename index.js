// Library Code
function createStore (reducer) {
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
		state = reducer(state, action);
		
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


// App code
function todos (state = [], action) {
	if(action.type === 'ADD_TODO') {
		return state.concat([action.todo]);
	}
	
	return state;
}

/*
	It doesnn't make sense fr a library have access to todos function because it could be different for different apps and todos might not be in the same scope
	Therefore we need to pass in the reducer function
	const store = createStore(todos);
*/