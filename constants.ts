
import { RoadmapItem, RoadmapStatus } from './types';

export const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: 'basics',
    title: '1. Basics & Structure',
    description: 'Introduction to C, Variable, Constants, I/O.',
    subTopics: ['Structure of C Program', 'Variables & Data Types', 'Constants', 'Input & Output'],
    theory: `
### Structure of C Program
Every C program must have a \`main()\` function. It serves as the entry point for program execution.

\`\`\`c
#include <stdio.h> // Preprocessor Directive

int main() {       // Main function
    printf("Hello World"); // Statement
    return 0;      // Return statement
}
\`\`\`

### Variables & Data Types
C is strongly typed. Common types:
- \`int\`: Integers (e.g., 10, -5)
- \`float\`: Decimal numbers (e.g., 3.14)
- \`char\`: Single characters (e.g., 'A')
- \`double\`: Large decimal numbers

### Constants
Constants are fixed values that cannot be altered by the program.
Defined using \`const\` keyword or \`#define\` preprocessor.

### Input & Output
- \`printf()\`: Used to output text to the screen.
- \`scanf()\`: Used to take input from the user.
`,
    practiceQuestions: [
      '1. Define constants and variables in C with suitable examples.',
      '6. What is computational thinking? Explain its importance with examples.',
      '10. Write a C program to input two numbers and perform all arithmetic operations.',
      '43. What is the difference between variables and constants? Explain with examples.',
      '50. Write a program to calculate the sum of two numbers and demonstrate formatted input/output.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'flow',
    defaultCode: `#include <stdio.h>

int main() {
    int a;
    float b;
    
    printf("Enter an integer and a float: ");
    // Note: In this simulated environment, input is not interactive.
    // We will simulate input by hardcoding values.
    a = 10;
    b = 5.5;
    
    printf("You entered Integer: %d\\n", a);
    printf("You entered Float: %.2f\\n", b);
    
    return 0;
}`
  },
  {
    id: 'operators',
    title: '2. Operators',
    description: 'Arithmetic, Relational, Logical, Bitwise.',
    subTopics: ['Arithmetic Operators', 'Relational Operators', 'Logical Operators', 'Bitwise Operators'],
    theory: `
### Arithmetic Operators
Operators tell the compiler to perform specific mathematical manipulations.
\`+\`, \`-\`, \`*\`, \`/\`, \`%\` (Modulus)

### Relational Operators
Used for comparison. Returns true (1) or false (0).
\`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`

### Logical Operators
Used to combine conditions.
- \`&&\` (AND): True if both are true.
- \`||\` (OR): True if at least one is true.
- \`!\` (NOT): Reverses the state.

### Bitwise Operators
Operate on bits directly. Essential for systems programming.
\`&\` (AND), \`|\` (OR), \`^\` (XOR), \`~\` (NOT), \`<<\` (Left Shift), \`>>\` (Right Shift)
`,
    practiceQuestions: [
      '4. Explain the purpose and usage of relational and logical operators in C.',
      '21. Explain different types of operators available in C with examples.',
      '30. What are bitwise operators in C? Demonstrate their working with an example.',
      '37. Explain the purpose of operators and expressions in C with examples.',
      '47. Define type casting in C and explain its purpose with examples.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'memory',
    defaultCode: `#include <stdio.h>

int main() {
    int a = 10, b = 3;
    
    printf("Arithmetic: %d / %d = %d\\n", a, b, a/b);
    printf("Modulus: %d %% %d = %d\\n", a, b, a%b);
    
    // Bitwise AND
    // 10 = 1010, 3 = 0011 -> 10 & 3 = 0010 (2)
    printf("Bitwise AND (10 & 3): %d\\n", a & b);
    
    return 0;
}`
  },
  {
    id: 'control_flow',
    title: '3. Control Flow',
    description: 'Decisions: if, if-else, switch, nested if.',
    subTopics: ['If-Else Statement', 'Nested If', 'Switch Case', 'Ternary Operator'],
    theory: `
### If-Else Statement
Control flow statements change the execution order.
\`\`\`c
if (condition) {
    // code if true
} else {
    // code if false
}
\`\`\`

### Nested If
An \`if\` statement inside another \`if\` statement.

### Switch Case
Used when checking one variable against many values. Cleaner than multiple else-ifs.
\`\`\`c
switch(expression) {
    case constant1: 
        // statements
        break;
    default: 
        // default statements
}
\`\`\`

### Ternary Operator
Short hand for if-else: \`condition ? true_val : false_val;\`
`,
    practiceQuestions: [
      '7. Describe the syntax and working of nested if–else statements with examples.',
      '14. Write an algorithm and draw a flowchart to find the largest among three numbers.',
      '20. Write a C program to check whether a number is even or odd using an if–else statement.',
      '33. Write a C program to find the largest number among three numbers using conditional statements.',
      '36. Write a C program to check whether a number is even or odd using conditional statements.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'flow',
    defaultCode: `#include <stdio.h>

int main() {
    int num = 7;
    
    // If-Else
    if (num % 2 == 0) {
        printf("%d is Even\\n", num);
    } else {
        printf("%d is Odd\\n", num);
    }
    
    // Switch Case
    int day = 3;
    switch(day) {
        case 1: printf("Monday\\n"); break;
        case 2: printf("Tuesday\\n"); break;
        case 3: printf("Wednesday\\n"); break;
        default: printf("Other Day\\n");
    }
    
    return 0;
}`
  },
  {
    id: 'loops',
    title: '4. Loops & Iteration',
    description: 'for, while, do-while loops.',
    subTopics: ['While Loop', 'For Loop', 'Do-While Loop', 'Break & Continue'],
    theory: `
### While Loop
Best when iterations depend on a condition not known in advance.
\`\`\`c
while (condition) {
    // code
}
\`\`\`

### For Loop
Best when you know the number of iterations.
\`\`\`c
for (int i = 0; i < 10; i++) {
    printf("%d", i);
}
\`\`\`

### Do-While Loop
Executes at least once before checking condition.
\`\`\`c
do {
    // code
} while (condition);
\`\`\`

### Break & Continue
- **Break**: Exits the loop immediately.
- **Continue**: Skips the current iteration and jumps to the next one.
`,
    practiceQuestions: [
      '8. Write a C program to calculate the sum of digits of a number using a while loop.',
      '16. Write a C program to display the multiplication table of any given number using a for loop.',
      '28. Write a C program to calculate the sum and average of five numbers using loops.',
      '29. Explain the use of break and continue statements in C loops with examples.',
      '34. Explain the different types of loops in C with syntax and examples.',
      '35. Write a program to calculate the factorial of a number using loops.',
      '39. Differentiate between while and do–while loops with suitable examples.',
      '40. Write a C program to calculate the sum of n natural numbers using a while loop.',
      '49. Explain the difference between while and do–while loops with examples.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'loop',
    defaultCode: `#include <stdio.h>

int main() {
    int i;
    
    printf("For Loop:\\n");
    for(i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\\n");
    
    printf("While Loop (Sum of 1 to 5):\\n");
    int sum = 0;
    int j = 1;
    while(j <= 5) {
        sum += j;
        j++;
    }
    printf("Sum is: %d\\n", sum);
    
    return 0;
}`
  },
  {
    id: 'patterns',
    title: '5. Patterns Logic',
    description: 'Star patterns, Number pyramids, Logic building.',
    subTopics: ['Right Triangle', 'Pyramid Pattern', 'Number Patterns', 'Floyds Triangle'],
    theory: `
### Right Triangle
Patterns help master nested loops.
\`\`\`c
*
* *
* * *
\`\`\`

### Pyramid Pattern
Requires handling spaces before stars.

### Number Patterns
Printing \`i\` or \`j\` instead of stars changes the output to numbers.

### Floyds Triangle
A right triangle with consecutive natural numbers.
\`\`\`c
1
2 3
4 5 6
\`\`\`
`,
    practiceQuestions: [
      'Write a program to print a solid square star pattern.',
      'Write a program to print a right-angled number triangle.',
      'Write a program to print a full pyramid of stars.',
      'Write a program to print Floyd’s Triangle.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'grid',
    defaultCode: `#include <stdio.h>

int main() {
    int rows = 5;
    
    printf("Right Triangle:\\n");
    for(int i = 1; i <= rows; i++) {
        for(int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\\n");
    }
    
    printf("\\nFloyd's Triangle:\\n");
    int num = 1;
    for(int i = 1; i <= 4; i++) {
        for(int j = 1; j <= i; j++) {
            printf("%d ", num);
            num++;
        }
        printf("\\n");
    }
    
    return 0;
}`
  },
  {
    id: 'functions',
    title: '6. Functions & Recursion',
    description: 'Modular programming, Recursion, Call by Value/Reference.',
    subTopics: ['Function Definition', 'Recursion', 'Call by Value vs Reference', 'Storage Classes'],
    theory: `
### Function Definition
Functions break a large program into smaller, manageable chunks.
Syntax: \`return_type function_name(parameters) { body }\`

### Recursion
A function calling itself.
- **Base Case**: The condition to stop recursion.
- **Recursive Case**: The call to itself.

### Call by Value vs Reference
- **Value**: Copy of data is passed. Changes don't affect original.
- **Reference**: Address is passed. Changes affect original (requires pointers).

### Storage Classes
- \`auto\`: Local variables (default).
- \`static\`: Preserves value between calls.
- \`extern\`: Global access.
- \`register\`: stored in CPU register.
`,
    practiceQuestions: [
      '2. Explain the concept of recursion in C with a suitable example.',
      '5. Write a C program to find the factorial of a number using recursion.',
      '11. Differentiate between local and global variables with examples.',
      '12. Write short notes on: (b) Functions in C.',
      '15. Explain recursion in C with an example program.',
      '22. Write a recursive program to generate the Fibonacci series.',
      '24. Explain the concept of functions and different parameter passing techniques in C.',
      '25. Write a program to demonstrate call by value and call by reference in C.',
      '32. Explain the concept of passing an array to a function with an example.',
      '42. Write a program to reverse a string using recursion.',
      '45. Write a C program to display the Fibonacci series using recursion.',
      '48. Write a program to find the factorial of a number using a user-defined function.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'stack',
    defaultCode: `#include <stdio.h>

// Function Prototype
int add(int, int);

// Recursive Function
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    printf("Sum: %d\\n", add(10, 20));
    
    printf("Fibonacci Series (first 5): ");
    for(int i=0; i<5; i++) {
        printf("%d ", fibonacci(i));
    }
    printf("\\n");
    
    return 0;
}

int add(int a, int b) {
    return a + b;
}
`
  },
  {
    id: 'arrays',
    title: '7. Arrays',
    description: '1D, 2D Arrays, Matrix operations.',
    subTopics: ['1D Arrays', '2D Arrays (Matrices)', 'Multi-dimensional Arrays'],
    theory: `
### 1D Arrays
An array is a collection of items stored at contiguous memory locations.
\`int arr[5];\`

### 2D Arrays (Matrices)
\`int matrix[3][3];\`
Visualized as a grid, but stored linearly in memory. Used heavily in mathematical computations.

### Multi-dimensional Arrays
Arrays with more than 2 dimensions, e.g., \`int cube[3][3][3]\`.
`,
    practiceQuestions: [
      '9. Explain the concept of arrays and describe how memory is organized for a 2D array.',
      '17. Explain arrays and write a program to find the largest element in a given array.',
      '27. Write a C program to calculate the transpose of a matrix.',
      '38. Write a C program to find the maximum element in a one-dimensional array.',
      '46. Explain multidimensional arrays with examples.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'array',
    defaultCode: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    
    // Find Max
    int max = arr[0];
    for(int i=1; i<5; i++) {
        if(arr[i] > max) max = arr[i];
    }
    printf("Max element: %d\\n", max);
    
    // 2D Array
    int matrix[2][2] = {{1, 2}, {3, 4}};
    printf("Element at [1][1]: %d\\n", matrix[1][1]);
    
    return 0;
}`
  },
  {
    id: 'pointers',
    title: '8. Pointers',
    description: 'Addresses, Pointer Arithmetic, Pointers & Arrays.',
    subTopics: ['Pointer Basics', 'Pointer Arithmetic', 'Pointers and Arrays'],
    theory: `
### Pointer Basics
A pointer is a variable that stores the memory address of another variable.
- \`&\`: Address-of operator.
- \`*\`: Dereference operator (value at address).

### Pointer Arithmetic
Since arrays are contiguous, incrementing a pointer (\`ptr++\`) moves it to the next element based on the data type size (e.g., +4 bytes for int).

### Pointers and Arrays
Name of an array is actually a pointer to its first element. \`arr[i]\` is equivalent to \`*(arr + i)\`.
`,
    practiceQuestions: [
      '12. Write short notes on: (a) Pointers.',
      '18. Define pointer arithmetic and explain with an appropriate example.',
      '19. Explain the declaration and initialization of pointers to arrays with examples.',
      '44. Explain the use and importance of pointer variables in C with examples.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'pointer',
    defaultCode: `#include <stdio.h>

int main() {
    int var = 20;
    int *ptr;
    
    ptr = &var; // Store address of var
    
    printf("Value of var: %d\\n", var);
    printf("Address of var: %p\\n", ptr);
    printf("Value via pointer: %d\\n", *ptr);
    
    // Changing value via pointer
    *ptr = 30;
    printf("New value of var: %d\\n", var);
    
    return 0;
}`
  },
  {
    id: 'strings',
    title: '9. Strings',
    description: 'String handling functions in string.h',
    subTopics: ['String Functions', 'String Manipulation'],
    theory: `
### String Functions
C Strings are null-terminated char arrays.
Library: \`<string.h>\`
- \`strlen(s)\`: Length of string.
- \`strcpy(d, s)\`: Copy s to d.
- \`strcat(d, s)\`: Concatenate s to d.
- \`strcmp(s1, s2)\`: Compare strings.

### String Manipulation
Manually iterating over a string until \`\\0\` is found.
`,
    practiceQuestions: [
      '41. Explain string handling functions in C with examples.',
      'Write a program to count vowels in a string.',
      'Write a program to check if a string is a palindrome.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'array',
    defaultCode: `#include <stdio.h>
#include <string.h>

int main() {
    char str1[] = "Hello";
    char str2[] = "World";
    char result[50];
    
    strcpy(result, str1);
    strcat(result, " ");
    strcat(result, str2);
    
    printf("Combined: %s\\n", result);
    printf("Length: %lu\\n", strlen(result));
    
    // Compare
    if (strcmp(str1, "Hello") == 0) {
        printf("str1 is Hello\\n");
    }
    
    return 0;
}`
  },
  {
    id: 'structs',
    title: '10. Structures & Unions',
    description: 'User defined data types.',
    subTopics: ['Structure Definition', 'Unions', 'Typedef'],
    theory: `
### Structure Definition
A collection of variables of different types under a single name.
\`\`\`c
struct Student {
    int id;
    char name[20];
};
\`\`\`

### Unions
Similar to struct, but all members share the same memory location. Size is equal to the largest member. Efficient for memory.

### Typedef
Creates an alias for a type. \`typedef struct Student Student;\` allows using \`Student\` instead of \`struct Student\`.
`,
    practiceQuestions: [
      'Create a structure for Employee details.',
      'Demonstrate the difference between Struct and Union sizes.',
      'Write a program using an array of structures to store data of 5 students.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'struct',
    defaultCode: `#include <stdio.h>
#include <string.h>

struct Person {
    char name[50];
    int age;
    float salary;
};

int main() {
    struct Person p1;
    
    strcpy(p1.name, "Alice");
    p1.age = 25;
    p1.salary = 50000.50;
    
    printf("Name: %s\\n", p1.name);
    printf("Age: %d\\n", p1.age);
    printf("Salary: %.2f\\n", p1.salary);
    
    return 0;
}`
  },
  {
    id: 'file_handling',
    title: '11. File Handling',
    description: 'File operations: open, read, write, close.',
    subTopics: ['File Operations', 'File Modes'],
    theory: `
### File Operations
Permanent storage of data.
- \`fopen("filename", "mode")\`: Opens a file.
- \`fprintf()\`: Writes formatted output to file.
- \`fscanf()\`: Reads formatted input from file.
- \`fclose()\`: Closes the file.

### File Modes
- "w": Write (Overwrites)
- "r": Read
- "a": Append
- "r+": Read/Write
`,
    practiceQuestions: [
      '26. Explain file handling in C with a suitable example program.',
      'Write a program to copy one file to another.',
      'Write a program to count characters, words, and lines in a file.'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'file',
    defaultCode: `#include <stdio.h>

int main() {
    FILE *fp;
    
    // Write to file
    fp = fopen("data.txt", "w");
    if(fp == NULL) {
        printf("Error opening file!\\n");
        return 1;
    }
    fprintf(fp, "Hello File System\\n");
    fprintf(fp, "C Programming is fun\\n");
    fclose(fp);
    
    // Read from file
    char buffer[100];
    fp = fopen("data.txt", "r");
    printf("File Contents:\\n");
    while(fgets(buffer, 100, fp)) {
        printf("%s", buffer);
    }
    fclose(fp);
    
    return 0;
}`
  },
  {
    id: 'dynamic_memory',
    title: '12. Dynamic Memory',
    description: 'malloc, calloc, realloc, free.',
    subTopics: ['Malloc vs Calloc', 'Realloc & Free', 'Memory Leaks'],
    theory: `
### Malloc vs Calloc
Allocating memory at runtime using \`<stdlib.h>\`.
- **malloc(size)**: Allocates block of uninitialized memory. Returns void*.
- **calloc(n, size)**: Allocates n blocks initialized to zero.

### Realloc & Free
- **realloc(ptr, new_size)**: Resizes previously allocated memory.
- **free(ptr)**: Deallocates memory.

### Memory Leaks
Occurs when allocated memory is not freed. Always pair \`malloc\` with \`free\`.
`,
    practiceQuestions: [
      'Write a program to allocate memory for an array dynamically.',
      'Explain the difference between malloc and calloc.',
      'What is a memory leak? How to avoid it?'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'heap',
    defaultCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr;
    int n = 5;
    
    // Allocate memory for 5 integers
    arr = (int*)malloc(n * sizeof(int));
    
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }
    
    // Initialize and print
    for(int i=0; i<n; i++) {
        arr[i] = i * 10;
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    // Free memory
    free(arr);
    printf("Memory freed.\\n");
    
    return 0;
}`
  },
  {
    id: 'leetcode_advanced',
    title: '13. FAANG / LeetCode Logic',
    description: 'Advanced algorithms and data structures.',
    subTopics: ['Linked Lists', 'Sorting Algorithms', 'Searching Algorithms', 'Bit Manipulation', 'Binary Trees'],
    theory: `
### Linked Lists
A chain of nodes where each node contains data and a pointer to the next node.
Dynamic size, efficient insertions/deletions.
\`\`\`c
struct Node { int data; struct Node* next; };
\`\`\`

### Sorting Algorithms
- **Bubble Sort**: Swaps adjacent elements. O(n^2).
- **Merge Sort**: Divide and conquer. O(n log n).
- **Quick Sort**: Pivot based. O(n log n) avg.

### Searching Algorithms
- **Binary Search**: O(log n) on sorted arrays.

### Bit Manipulation
Using bitwise operators to solve problems like "Single Number", "Power of Two", "Count Set Bits".

### Binary Trees
Hierarchical structure. Each node has at most two children (left, right).
`,
    practiceQuestions: [
      '3. Write a C program to check whether a given number is prime.',
      'Reverse a Linked List (LeetCode Easy).',
      'Detect Cycle in a Linked List (LeetCode Medium).',
      'Merge Two Sorted Lists.',
      'Implement Binary Search (LeetCode Easy).',
      'Find the Single Number in an array where every other appears twice (Bit Manipulation).'
    ],
    status: RoadmapStatus.ACTIVE,
    visualType: 'linked_list',
    defaultCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

// Add node to start
void push(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}

void printList(struct Node* node) {
    while (node != NULL) {
        printf("%d -> ", node->data);
        node = node->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    
    push(&head, 30);
    push(&head, 20);
    push(&head, 10);
    
    printf("Linked List: ");
    printList(head);
    
    return 0;
}`
  }
];
