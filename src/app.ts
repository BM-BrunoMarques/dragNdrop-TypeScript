interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
  }
  if (typeof validatableInput.value === 'number' && validatableInput.min != null) {
    isValid = isValid && validatableInput.value >= validatableInput.min
  }
  if (typeof validatableInput.value === 'number' && validatableInput.max != null) {
    isValid = isValid && validatableInput.value <= validatableInput.max
  }
  return isValid;
}

// autoBind decorator
function autoBind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input'

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = +this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      max: 5
    }
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    }


    if (!validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!')
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      console.log(title, desc, people);
      this.clearInputs()
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();

// // Test to see if the browser supports the HTML template element by checking
// // for the presence of the template element's content attribute.

// const appContent = document.getElementById("app")!;

// const renderTemplate = (divID: string): void => {
//   const template = document.getElementById(divID) as HTMLTemplateElement
//   const clonedTemplate = template.content.cloneNode(true)
//   appContent.appendChild(clonedTemplate)
// }

// if ('content' in document.createElement('template')) {

//   // Instantiate the table with the existing HTML tbody
//   // and the row with the template
//   renderTemplate('project-input');
//   renderTemplate('single-project');
//   renderTemplate('project-list');

//   const listedProjects: { title: string, description: string }[] = []

//   const submitBtn = document.querySelector('button')!
//   submitBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const title = document.getElementById('title') as HTMLInputElement
//     const description = document.getElementById('description') as HTMLInputElement
//     // const people = document.getElementById('people') as HTMLInputElement

//     listedProjects.push({ title: title.value, description: description.value })

//     listedProjects.forEach((el) => {
//       const node = document.createElement('li');
//       const textnode = document.createTextNode(el.title);
//       node.appendChild(textnode)
//       appContent.appendChild(node)
//     })
//   })


//   // // Clone the new row and insert it into the table
//   // var clone = template.content.cloneNode(true) as any;
//   // var td = clone.querySelectorAll("td");
//   // td[0].textContent = "1235646565";
//   // td[1].textContent = "Stuff";

//   // tbody.appendChild(clone);

//   // // Clone the new row and insert it into the table
//   // var clone2 = template.content.cloneNode(true) as any;
//   // td = clone2.querySelectorAll("td");
//   // td[0].textContent = "0384928528";
//   // td[1].textContent = "Acme Kidney Beans 2";

//   // tbody.appendChild(clone2);

// } else {
//   // Find another way to add the rows to the table because
//   // the HTML template element is not supported.
// }