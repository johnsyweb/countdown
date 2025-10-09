// Countdown Solver Logic (adapted from TypeScript)

function combine(smaller, larger) {
  return [
    {
      left: smaller,
      operator: '+',
      right: larger,
      result: smaller + larger,
    },
    {
      left: smaller,
      operator: '*',
      right: larger,
      result: smaller * larger,
    },
    {
      left: larger,
      operator: '-',
      right: smaller,
      result: larger === smaller ? NaN : larger - smaller,
    },
    {
      left: larger,
      operator: '/',
      right: smaller,
      result: larger % smaller === 0 ? larger / smaller : NaN,
    },
  ].filter((step) => !isNaN(step.result));
}

function getRemainingNumbers(numbers, i, j) {
  return numbers.filter((_, idx) => idx !== i && idx !== j);
}

function findSolutionsForStep(step, target, numbers, i, j) {
  if (step.result === target) {
    return [[step]];
  }

  if (numbers.length <= 2) {
    return [];
  }

  const remainingNumbers = getRemainingNumbers(numbers, i, j);
  const newPool = [...remainingNumbers, step.result];
  const subSolutions = solve(newPool, target);

  if (!subSolutions) {
    return [];
  }

  return subSolutions.map((subSolution) => [step, ...subSolution]);
}

function findSolutionsForPair(numbers, target, i, j) {
  const [smaller, larger] = [numbers[i], numbers[j]].sort((a, b) => a - b);
  const steps = combine(smaller, larger);

  return steps.flatMap((step) =>
    findSolutionsForStep(step, target, numbers, i, j)
  );
}

function getAllPairs(length) {
  return Array.from({ length }, (_, i) => i).flatMap((i) =>
    Array.from({ length: length - i - 1 }, (_, k) => [i, i + k + 1])
  );
}

function deduplicateSolutions(solutions) {
  const seen = new Set();
  return solutions.filter((solution) => {
    const key = JSON.stringify(solution);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function solve(numbers, target) {
  if (numbers.length < 2) {
    return null;
  }

  const allSolutions = getAllPairs(numbers.length).flatMap(([i, j]) =>
    findSolutionsForPair(numbers, target, i, j)
  );

  const solutions = deduplicateSolutions(allSolutions);

  return solutions.length > 0 ? solutions : null;
}

// UI Logic

document.addEventListener('DOMContentLoaded', () => {
  const targetInput = document.getElementById('target');
  const numberCards = document.querySelectorAll('.number-card');
  const solveBtn = document.getElementById('solve-btn');
  const solutionsDiv = document.getElementById('solutions');

  // Auto-tab functionality for number cards
  numberCards.forEach((card, index) => {
    card.addEventListener('input', (e) => {
      if (e.target.value.length === e.target.maxLength && index < numberCards.length - 1) {
        numberCards[index + 1].focus();
      }
    });

    // Allow only numbers
    card.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });
  });

  // Allow only numbers in target
  targetInput.addEventListener('keypress', (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });

  // Handle Enter key
  targetInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      numberCards[0].focus();
    }
  });

  numberCards.forEach((card, index) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (index === numberCards.length - 1) {
          solveBtn.click();
        } else {
          numberCards[index + 1].focus();
        }
      }
    });
  });

  // Solve button click handler
  solveBtn.addEventListener('click', () => {
    const target = parseInt(targetInput.value);
    const numbers = Array.from(numberCards)
      .map((card) => parseInt(card.value))
      .filter((n) => !isNaN(n) && n > 0);

    // Validation
    solutionsDiv.innerHTML = '';
    solutionsDiv.classList.remove('show');

    if (isNaN(target) || target < 1) {
      showError('Please enter a valid target number');
      return;
    }

    if (numbers.length < 2) {
      showError('Please enter at least 2 numbers');
      return;
    }

    // Solve
    solveBtn.disabled = true;
    solveBtn.textContent = 'Solving...';

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const solutions = solve(numbers, target);
      displaySolutions(solutions, target);
      solveBtn.disabled = false;
      solveBtn.textContent = 'Solve';
    }, 100);
  });

  function showError(message) {
    solutionsDiv.classList.add('show');
    solutionsDiv.innerHTML = `<div class="error-message">${message}</div>`;
  }

  function displaySolutions(solutions, target) {
    solutionsDiv.classList.add('show');

    if (!solutions) {
      solutionsDiv.innerHTML = `
        <div class="solution-header">No Solution Found</div>
        <div class="no-solution">
          No way to reach ${target} with the given numbers.
        </div>
      `;
      return;
    }

    const maxSolutions = 5; // Show first 5 solutions
    const displayCount = Math.min(solutions.length, maxSolutions);

    let html = `
      <div class="solution-header">
        Found ${solutions.length} solution${solutions.length !== 1 ? 's' : ''}
        ${solutions.length > maxSolutions ? ` (showing first ${maxSolutions})` : ''}
      </div>
    `;

    for (let i = 0; i < displayCount; i++) {
      const solution = solutions[i];
      html += `
        <div class="solution">
          <div class="solution-title">Solution ${i + 1}</div>
          ${solution
            .map(
              (step, idx) => `
            <div class="step">
              <span class="step-number">${idx + 1}</span>
              <span class="step-content">
                ${step.left}
                <span class="operator">${step.operator}</span>
                ${step.right}
                <span class="operator">=</span>
                <span class="result">${step.result}</span>
              </span>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    }

    solutionsDiv.innerHTML = html;
  }
});

