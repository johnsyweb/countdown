import { solve, type Step } from '../src/solve';
import { isGoldenPath } from '../src/isGoldenPath';

// UI Logic

document.addEventListener('DOMContentLoaded', () => {
  const targetInput = document.getElementById('target') as HTMLInputElement;
  const numberCards =
    document.querySelectorAll<HTMLInputElement>('.number-card');
  const solveBtn = document.getElementById('solve-btn') as HTMLButtonElement;
  const solutionsDiv = document.getElementById('solutions') as HTMLDivElement;

  // Populate from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  let allFieldsFilled = false;

  // Populate target
  const targetParam = urlParams.get('target');
  if (targetParam) {
    targetInput.value = targetParam;
  }

  // Populate numbers (support both comma-separated and individual parameters)
  const numbersParam = urlParams.get('numbers');
  if (numbersParam) {
    const numbers = numbersParam.split(',').filter((n) => n.trim() !== '');
    numbers.forEach((num, index) => {
      if (index < numberCards.length) {
        numberCards[index].value = num.trim();
      }
    });
    allFieldsFilled = targetParam !== null && numbers.length === 6;
  } else {
    // Check for individual n1, n2, n3, n4, n5, n6 parameters
    let filledCount = 0;
    for (let i = 0; i < 6; i++) {
      const numParam = urlParams.get(`n${i + 1}`);
      if (numParam) {
        numberCards[i].value = numParam;
        filledCount++;
      }
    }
    allFieldsFilled = targetParam !== null && filledCount === 6;
  }

  // Auto-solve if all fields are filled
  if (allFieldsFilled) {
    // Use setTimeout to ensure UI is fully rendered
    setTimeout(() => {
      solveBtn.click();
    }, 100);
  }

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

  function generateSolutionId(solution: Step[]): string {
    // Create a unique ID based on the solution steps
    const solutionString = solution
      .map((step) => `${step.left}${step.operator}${step.right}=${step.result}`)
      .join('-');
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < solutionString.length; i++) {
      const char = solutionString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `solution-${Math.abs(hash)}`;
  }

  function buildPermalink(
    target: number,
    numbers: number[],
    solutionId: string
  ): string {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('target', target.toString());
    params.set('numbers', numbers.join(','));
    return `${baseUrl}?${params.toString()}#${solutionId}`;
  }

  function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
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

      groupSolutions.forEach((solution, solutionIndex) => {
        const solutionId = generateSolutionId(solution);
        html += `<div class="solution" id="${solutionId}">`;

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

        // Add share button
        html += `
          <button class="share-button" data-solution-id="${solutionId}" title="Copy link to this solution" aria-label="Copy permalink to this solution">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3.5C10 2.67157 10.6716 2 11.5 2C12.3284 2 13 2.67157 13 3.5V6.5C13 7.32843 12.3284 8 11.5 8C10.6716 8 10 7.32843 10 6.5V3.5Z" fill="currentColor"/>
              <path d="M6 9.5C6 8.67157 6.67157 8 7.5 8C8.32843 8 9 8.67157 9 9.5V12.5C9 13.3284 8.32843 14 7.5 14C6.67157 14 6 13.3284 6 12.5V9.5Z" fill="currentColor"/>
              <path d="M3.5 6C4.32843 6 5 6.67157 5 7.5V8.5C5 9.32843 4.32843 10 3.5 10C2.67157 10 2 9.32843 2 8.5V7.5C2 6.67157 2.67157 6 3.5 6Z" fill="currentColor"/>
              <path d="M11 9.5C11 8.67157 11.6716 8 12.5 8C13.3284 8 14 8.67157 14 9.5V10.5C14 11.3284 13.3284 12 12.5 12C11.6716 12 11 11.3284 11 10.5V9.5Z" fill="currentColor"/>
              <path d="M4.5 3.5L9 6.5M9 9.5L4.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Share
          </button>
        `;

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

    // Add share button functionality
    const shareButtons =
      solutionsDiv.querySelectorAll<HTMLButtonElement>('.share-button');
    shareButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const solutionId = button.dataset.solutionId;
        if (!solutionId) return;

        const numbers = Array.from(numberCards)
          .map((card) => parseInt(card.value))
          .filter((n) => !isNaN(n) && n > 0);

        const permalink = buildPermalink(target, numbers, solutionId);

        try {
          await copyToClipboard(permalink);
          // Show feedback
          const originalText = button.innerHTML;
          button.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!';
          button.classList.add('copied');
          setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          button.textContent = 'Failed to copy';
          setTimeout(() => {
            button.innerHTML =
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.5C10 2.67157 10.6716 2 11.5 2C12.3284 2 13 2.67157 13 3.5V6.5C13 7.32843 12.3284 8 11.5 8C10.6716 8 10 7.32843 10 6.5V3.5Z" fill="currentColor"/><path d="M6 9.5C6 8.67157 6.67157 8 7.5 8C8.32843 8 9 8.67157 9 9.5V12.5C9 13.3284 8.32843 14 7.5 14C6.67157 14 6 13.3284 6 12.5V9.5Z" fill="currentColor"/><path d="M3.5 6C4.32843 6 5 6.67157 5 7.5V8.5C5 9.32843 4.32843 10 3.5 10C2.67157 10 2 9.32843 2 8.5V7.5C2 6.67157 2.67157 6 3.5 6Z" fill="currentColor"/><path d="M11 9.5C11 8.67157 11.6716 8 12.5 8C13.3284 8 14 8.67157 14 9.5V10.5C14 11.3284 13.3284 12 12.5 12C11.6716 12 11 11.3284 11 10.5V9.5Z" fill="currentColor"/><path d="M4.5 3.5L9 6.5M9 9.5L4.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> Share';
          }, 2000);
        }
      });
    });

    // Scroll to anchor if present in URL
    if (window.location.hash) {
      const targetElement = document.getElementById(
        window.location.hash.substring(1)
      );
      if (targetElement) {
        // Expand the group containing this solution
        const parentGroup = targetElement.closest('.group-solutions');
        if (parentGroup) {
          const groupId = parentGroup.dataset.group;
          const groupTitle = solutionsDiv.querySelector(
            `.group-title[data-group="${groupId}"]`
          ) as HTMLButtonElement;
          if (groupTitle) {
            toggleGroup(groupTitle);
          }
        }
        // Scroll to the solution with a slight delay to ensure rendering
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElement.classList.add('highlighted');
          setTimeout(() => {
            targetElement.classList.remove('highlighted');
          }, 2000);
        }, 150);
      }
    }
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
