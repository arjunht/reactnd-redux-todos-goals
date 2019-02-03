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

// Constants are better than strings : We can ensure an error will be thrown for misspelled action types
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

/*
	Abstracting all of our different actions into their own functions called Action creators
	Whenever we want to dispatch an action, call our action creators which will return us the specific action
*/
function addTodoAction (todo) {
	return {
		type: ADD_TODO,
		todo
	}
}

function removeTodoAction (id) {
	return {
		type: REMOVE_TODO,
		id
	}
}

function toggleTodoAction (id) {
	return {
		type: TOGGLE_TODO,
		id
	}
}

function addGoalAction (goal) {
	return {
		type: ADD_GOAL,
		goal
	}
}

function removeGoalAction (id) {
	return {
		type: REMOVE_GOAL,
		id
	}
}

function todos (state = [], action) {
	switch (action.type) {
		case ADD_TODO :
			return state.concat([action.todo]);
		case REMOVE_TODO :
			return state.filter((todo) => todo.id !== action.id);
		case TOGGLE_TODO :
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

function goals (state = [], action) {
	switch (action.type) {
		case ADD_GOAL :
			return state.concat([action.goal]);
		case REMOVE_GOAL :
			return state.filter((goal) => goal.id !== action.id);
		default :
			return state;
	}	
}

// Root reducer
function app (state = {}, action) {
	/*
		We are invoking todos here to get the todos portion of our state
		state.todos - todos portion of our state
	*/
	return {
		todos: todos(state.todos, action),
		goals: goals(state.goals, action)
	}
	/*
		Whenever we want to add new state to our store, add a new property to this object and the value of that property is going to be a reducer function, which is going to be responsbile for managing that slice of our state.
	*/
}

/*
	It doesn't make sense for a library have access to todos function because it could be different for different apps and todos might not be in the same scope
	Therefore we need to pass in the reducer function
	const store = createStore(todos);
*/

// Even though we have two reducer functions - todos and goals - but when we invoke createStore, we need to pass it only a single reducer - thats why we need to use a root reducer - app
const store = createStore(app);

const unsubscribe = store.subscribe(() => {
	console.log('The new state is', store.getState());
});

unsubscribe(); // This doesn't seem to be working becuase of a listeners bug above, fixed

store.subscribe(() => {
	console.log('The new state after unsubscribe is ', store.getState());
});

store.dispatch(addTodoAction({
	id: 0,
	name: 'Walk the dog',
	complete: false,
}));

store.dispatch(addTodoAction({
	id: 1,
	name: 'Wash the car',
	complete: false,
}));

store.dispatch(addTodoAction({
	id: 2,
	name: 'Go to the gym',
	complete: true,
}))

store.dispatch(removeTodoAction(1));

store.dispatch(toggleTodoAction(0));

store.dispatch(addGoalAction({
	id: 0,
	name: 'Learn Redux'
}));

store.dispatch(addGoalAction({
	id: 1,
	name: 'Lose 20 pounds'
}))

store.dispatch(removeGoalAction(0));
