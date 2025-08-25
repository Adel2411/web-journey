# Go Fundamentals: A Beginner's Guide

### 1. Packages & Imports: The Building Blocks

Every Go file starts with a `package` declaration. Packages are Go's way of organizing and reusing code.

- **`package main`**: This is a special package name. When the Go compiler sees this, it knows to create an executable program (a file you can run directly), not a shared library.
- **`import`**: To use code from other packages, you must `import` them. You can import packages from Go's standard library (like `fmt` or `log`) or from third-party sources (like `fiber` or the `mongo-driver`).

```go
package main // Declares an executable program

// Imports a block of required packages
import (
	"fmt"  // A standard library package for formatting text
	"log"  // For logging messages
	"github.com/gofiber/fiber/v2" // A third-party package from GitHub
)
```

### 2. The `main` Function: Your Program's Entry Pointc

If you have `package main`, you must also have a function called `main`. This is the "front door" to your application. When you run your compiled program, the code inside `func main()` is the first to execute.

```go
func main() {
	// Program execution starts here
	fmt.Println("Hello, Go!")
}
```

### 3. Variables: Storing Your Data

Variables hold the data your program works with. Go has two main ways to declare them.

- **`var` keyword**: The standard, more explicit way. You can declare a variable and its type, and optionally assign a value.
  ```go
  var name string = "Alice"
  var port int // Declares an integer, defaults to 0
  ```
- **`:=` (Short Declaration Operator)**: A very common shorthand used _inside functions_. It automatically infers the type of the variable from the value you assign to it.
  ```go
  // This is the same as: var message string = "Starting server..."
  message := "Starting server..."
  //
  // This is the same as:
  //  KWORD("var") VAR_NAME("err") VAR_TYPE("error")
  //  var err error = someFunction()
  err := someFunction()
  ```

### 4. Structs: Creating Your Own Data Types

A `struct` is a composite type that groups together variables (fields) under a single name. It's incredibly useful for modeling real-world entities. Think of it as a blueprint for your data.

In our workshop code, `Todo` is a struct that defines what a "todo" item looks like.

```go
// 'Todo' is a new type we've created.
type Todo struct {
	ID        primitive.ObjectID // A field named 'ID' of a special MongoDB type
	Completed bool               // A field for the completion status (true/false)
	Body      string             // A field for the task description text
}
```

**Struct Tags**: The text in backticks (`` `...` ``) are "struct tags". They are metadata that tells other packages how to handle these fields.

- `json:"body"`: Tells the JSON encoder/decoder to use the name "body" when converting this struct to and from JSON.

---

### 5. Error Handling: A Core Principle

Go handles errors differently than many languages that use `try/catch`. In Go, functions that can fail will return an `error` value as their last return value.

The standard way to handle this is to immediately check if the `error` is `nil` (meaning no error occurred).

```go
// os.Getenv can fail if the variable doesn't exist (though it returns an empty string)
// Many functions, like mongo.Connect, do return an error.
client, err := mongo.Connect(context.Background(), clientOptions)

// THE IDIOMATIC GO ERROR CHECK:
if err != nil {
	// An error occurred. Stop everything and report it.
	// log.Fatal() prints the error message and exits the program.
	log.Fatal(err)
}

// If the code reaches this point, it means 'err' was nil and the connection succeeded.
fmt.Println("Connected successfully!")
```

This pattern makes error handling explicit and is a fundamental part of writing robust Go code.
