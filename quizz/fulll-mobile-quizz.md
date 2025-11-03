# Fulll - Mobile Quizz  
  
  
### 1 - What would return the following code?  
**Answer:** B,   
**Explanation: **Fragments (<>...</>) do not add a wrapper element in the render tree.  
  
  
### 2 - Which reducer code do not follow best practices?  
**Answer:**A  
**Explanation:** Reducers must not mutate the state directly. Always return a new state object.  
  
  
### 3 - Which reducer code is correct?  
**Answer**: C   
  
  
### 4 - A higher-order component is a function that:  
**Answer**: A  
**Explanation:** A HOC is a function that takes a component and returns a new component.  
  
  
### 5 - What is "windowing"?  
**Answer**: A  
**Explanation:** A Windowing or list virtualization is an technique to render only visible items in large lists.  
  
  
### 6 - Which methods are not usable with React hooks?  
**Answer**: A, B, C  
**Explanation:** React Hooks replace class lifecycle methods (componentDidMount, componentWillUnmount, etc.).  
  
  
### 7  - Which status code is not an error?  
**Answer:** A, D  
**Explanation:**  
* 401 Unauthorized -> Error  
* 500 Internal Server Error -> Error  
* 200 OK -> Success   
* 204 OK -> Not content  
  
  
### 8 - Use Typescript to describe the following function which returns a success message when the request has been successfully sent, returns a code status when the request has failed.
```typescript
async function registerUser(name: string, age: number): Promise<string | number> {  
  try {  
    // Simulate an API request  
    const response = await apiRequest(name, age);  
  
    if (response.ok) {  
      return "Success";  
    } else {  
      return response.status; // HTTP status code, e.g., 400, 500  
    }  
  } catch (error) {  
    return 500;  
  }  
}  
```
  
### 10 - What does not permit to interact with servers within React Native project?
**Answer:** C  
**Explanation:** SwiftUI is not part of React Native, so it cannot be used to handle networking in a React Native project.  
