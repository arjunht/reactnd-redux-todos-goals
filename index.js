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
			listeners = listeners.filter(l => l !== listener)
			// Filter always returns a new array, so it needs to be set back to listeners after filtering out the unsubscribed listener
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
	switch (acion.type) {
		case 'ADD_TODO' :
			return state.concat([action.todo]);
		case 'REMOVE_TODO' :
			return state.filter((todo) => todo.id !== action.id);
		case 'TOGGLE_TODO' :
			/* 
				If the todos reducer function needs to be a pure function, we cannot directly modify the complete property of the todo object in the state
				Wrong: return state.map((todo) => todo.id === action.id ? todo.complete = !todo.complete : todo)
			*/
			return state.map((todo) => todo.id !== action.id ? todo :
				Object.assign({}, todo, { complete : !todo.complete }))
			/*
				Object.assign allows us to create a new object and merge different properties onto that object 
				So we create a new object {}, then merge all of the properties of the todo object, except for complete which is going to be exact opposite of what complete currently is
			*/
		default :
			return state;
	}	
}

/*
	It doesnn't make sense fr a library have access to todos function because it could be different for different apps and todos might not be in the same scope
	Therefore we need to pass in the reducer function
	const store = createStore(todos);
*/

const store = createStore(todos);

const unsubscribe = store.subscribe(() => {
	console.log('The new state is', store.getState());
});

unsubscribe(); // This doesn't seem to be working becuase of a listeners bug above, fixed

store.subscribe(() => {
	console.log('The new state after unsubscribe is ', store.getState());
});

store.dispatch({
	type: 'ADD_TODO',
	todo: {
		id: 0,
		name: 'Learn Redux',
		complete: false
	}
});