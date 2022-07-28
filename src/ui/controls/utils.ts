export const makeRange = (
  min: number,
  max: number,
  step: number,
  labelText: string,
  onChange: (value: string) => void,
  init: number = 0
) => {
  const input = document.createElement("input");
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(init);

  const label = document.createElement("label");

  const span = document.createElement("span");
  span.style.display = "block";
  span.textContent = `${labelText} ${input.value}`;

  input.oninput = (event) => {
    span.textContent = `${labelText} ${input.value}`;
    onChange((event.target as HTMLInputElement).value);
  };

  label.append(span, input);

  return label;
};
