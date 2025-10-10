import { solve, type Step } from '../src/solve';
import { isGoldenPath } from '../src/isGoldenPath';

// UI Logic

document.addEventListener('DOMContentLoaded', () => {
  const targetInput = document.getElementById('target') as HTMLInputElement;
  const numberCards =
    document.querySelectorAll<HTMLInputElement>('.number-card');
  const solveBtn = document.getElementById('solve-btn') as HTMLButtonElement;
  const solutionsDiv = document.getElementById('solutions') as HTMLDivElement;

  // Auto-tab functionality for number cards
  numberCards.forEach((card, index) => {
    card.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (
        target.value.length === target.maxLength &&
        index < numberCards.length - 1
      ) {
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

  function showError(message: string): void {
    solutionsDiv.classList.add('show');
    solutionsDiv.innerHTML = `<div class="error-message">${message}</div>`;
  }

  function displaySolutions(solutions: Step[][] | null, target: number): void {
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

    // Group solutions by number of steps
    const groupedSolutions = {};
    solutions.forEach((solution) => {
      const stepCount = solution.length;
      if (!groupedSolutions[stepCount]) {
        groupedSolutions[stepCount] = [];
      }
      groupedSolutions[stepCount].push(solution);
    });

    // Sort by step count (fewest first)
    const sortedStepCounts = Object.keys(groupedSolutions)
      .map(Number)
      .sort((a, b) => a - b);

    let html = `
      <div class="solution-header">
        Found ${solutions.length} solution${solutions.length !== 1 ? 's' : ''}
      </div>
    `;

    // Render each group
    sortedStepCounts.forEach((stepCount, groupIndex) => {
      const groupSolutions = groupedSolutions[stepCount];
      const hasGoldenPath = groupSolutions.some((solution) =>
        isGoldenPath(solution)
      );
      const goldenPathEmoji = hasGoldenPath ? ' ⭐' : '';

      html += `
        <div class="solution-group">
          <button class="group-title" data-group="${groupIndex}" role="button" tabindex="0" aria-expanded="false">
            <span class="toggle-icon">▶</span>
            ${stepCount} step${stepCount !== 1 ? 's' : ''} (${groupSolutions.length})${goldenPathEmoji}
          </button>
          <div class="group-solutions" data-group="${groupIndex}" style="display: none;">
      `;

      groupSolutions.forEach((solution) => {
        html += '<div class="solution">';

        // Track intermediate results
        const intermediateResults = new Set();

        solution.forEach((step, idx) => {
          const leftIsIntermediate = intermediateResults.has(step.left);
          const rightIsIntermediate = intermediateResults.has(step.right);

          html += `
            <div class="step">
              <span class="step-content">
                <span class="${leftIsIntermediate ? 'intermediate' : ''}">${step.left}</span>
                <span class="operator">${step.operator}</span>
                <span class="${rightIsIntermediate ? 'intermediate' : ''}">${step.right}</span>
                <span class="operator">=</span>
                <span class="result">${step.result}</span>
              </span>
            </div>
          `;

          // Add this step's result to intermediate results for next steps
          intermediateResults.add(step.result);
        });

        html += '</div>';
      });

      html += '</div></div>';
    });

    solutionsDiv.innerHTML = html;

    // Add collapse/expand functionality
    const groupTitles =
      solutionsDiv.querySelectorAll<HTMLButtonElement>('.group-title');
    groupTitles.forEach((title) => {
      title.addEventListener('click', () => {
        toggleGroup(title);
      });

      title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleGroup(title);
        }
      });
    });
  }

  function toggleGroup(titleButton: HTMLButtonElement): void {
    const groupId = titleButton.dataset.group;
    const content = solutionsDiv.querySelector<HTMLDivElement>(
      `.group-solutions[data-group="${groupId}"]`
    );
    const icon = titleButton.querySelector('.toggle-icon');

    if (!content || !icon) return;

    const isExpanded = titleButton.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      content.style.display = 'none';
      titleButton.setAttribute('aria-expanded', 'false');
      icon.textContent = '▶';
    } else {
      content.style.display = 'block';
      titleButton.setAttribute('aria-expanded', 'true');
      icon.textContent = '▼';
    }
  }
});
