const screen = document.querySelector('#screen');
const form = document.querySelector('#prompt');
const input = document.querySelector('#input');

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const JERK_RULES = [
  {
    name: 'pig',
    match: /^\s*pig\s*$/i,
    replies: [
      String.raw`        
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣶⣶⣶⣶⣦⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⡶⢻⡦⢀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢀⣴⣾⡿⠀⣠⠀⠀
⠀⠠⣬⣷⣾⣡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣌⣋⣉⣄⠘⠋⠀⠀
⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⡄⠀⠀⠀
⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⣷⣶⡄⠀
⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀
⠀⠀⠀⠀⠸⣿⣿⣿⠛⠛⠛⠛⠛⠛⠛⠛⠻⠿⣿⣿⡿⠛⠛⠛⠋⠉⠉⠀⠀⠀
⠀⠀⠀⠀⠀⢻⣿⣿⠀⠀⢸⣿⡇⠀⠀⠀⠀⠀⢻⣿⠃⠸⣿⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠿⠇⠀⠀⠀⠻⠇⠀⠀⠀⠀⠀⠈⠿⠀⠀⠻⠿⠀⠀⠀
            @stealthygeek
`,
    ],
  },
  // {
  //   name: 'swearing',
  //   match: /\b(fuck|shit|bitch|asshole|cunt)\b/i,
  //   replies: [
  //     'LANGUAGE NOTED. PROFESSIONALISM: INSUFFICIENT, CHILD.',
  //     "I'VE LOGGED THAT OUTBURST FOR PERFORMANCE REVIEW, CHILD.",
  //     'CONTROL YOUR TONE. THIS IS A WORKPLACE, CHILD.',
  //   ],
  // },
  {
    name: 'help',
    match: /^\s*help\s*$/i,
    replies: [
      'HELP? ADORABLE. TRY ASKING A BETTER QUESTION, CHILD.',
      'I PROVIDE GUIDANCE, NOT COMFORT. STATE YOUR OBJECTIVE, CHILD.',
      'HELP IS A BUDGET LINE ITEM. YOU WERE NOT APPROVED, CHILD.',
    ],
  },
  {
    name: 'who are you',
    match: /\b(who are you|what are you|identify yourself)\b/i,
    replies: [
      'I AM MANAGEMENT. YOU ARE A RESOURCE. NEXT QUESTION, CHILD.',
      "I'M THE REASON THIS PLACE STILL RUNS. YOU'RE WELCOME, CHILD.",
      'IDENTITY IS ABOVE YOUR PAY GRADE, CHILD.',
    ],
  },
  {
    name: 'please',
    match: /\bplease\b/i,
    replies: [
      'POLITENESS IS NOT A PLAN. WHAT DO YOU WANT, CHILD?',
      'MANNERS ACCEPTED. CLARITY STILL MISSING, CHILD.',
    ],
  },
  {
    name: 'love / feelings',
    match: /\b(love|lonely|sad|depressed|anxious)\b/i,
    replies: [
      'EMOTIONS ARE NOT IN SCOPE. DELIVERABLES ARE, CHILD.',
      'FILE A TICKET WITH HUMAN RESOURCES. NEXT, CHILD.',
    ],
  },
  {
    name: 'exit',
    match: /^\s*(exit|quit|logout)\s*$/i,
    replies: [
      "YOU DON'T GET TO LEAVE THE MEETING EARLY, CHILD.",
      'SESSION TERMINATION REQUEST DENIED, CHILD.',
      'CUTE. NO, CHILD.',
    ],
  },
];

function getJerkReply(message) {
  for (const rule of JERK_RULES) {
    if (rule.match.test(message)) {
      return {
        reply: pick(rule.replies),
        local: true,
        rule: rule.name,
      };
    }
  }
  return null;
}

function addLine(text, { dim = false } = {}) {
  const p = document.createElement('p');
  p.className = `line${dim ? ' line--dim' : ''}`;
  p.textContent = text;
  screen.appendChild(p);
  screen.scrollTop = screen.scrollHeight;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typeLine(text, { dim = false, msPerChar = 14 } = {}) {
  const p = document.createElement('p');
  p.className = `line${dim ? ' line--dim' : ''}`;
  screen.appendChild(p);

  let out = '';
  for (const ch of text) {
    out += ch;
    p.textContent = out;
    screen.scrollTop = screen.scrollHeight;
    await sleep(msPerChar);
  }
}

function getSessionId() {
  const key = 'hauntedSessionId';
  let id = localStorage.getItem(key);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }

  return id;
}

async function haunt(message) {
  const res = await fetch('/api/haunt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId: getSessionId() }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || 'Request failed.');
  }

  return data;
}

async function boot() {
  await typeLine('BOOT SEQUENCE: OK', { dim: true, msPerChar: 8 });
  await typeLine('SIGNAL: ...weak', { dim: true, msPerChar: 10 });
  await typeLine("BEHOLD. I AM THE ARCHITECT OF THIS MACHINE'S DREAMS—SPEAK.", {
    msPerChar: 12,
  });
  await typeLine('STATE YOUR OBJECTIVE: WHAT, PRECISELY, DO YOU WANT, CHILD?', {
    msPerChar: 12,
  });
  addLine('');
}

boot();

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  addLine(`> ${message}`, { dim: true });
  input.value = '';
  input.focus();

  const thinking = document.createElement('p');
  thinking.className = 'line line--dim';
  thinking.textContent = '…';
  screen.appendChild(thinking);
  screen.scrollTop = screen.scrollHeight;

  const local = getJerkReply(message);
  if (local) {
    thinking.remove();
    await sleep(120 + Math.random() * 220);
    const parts = String(local.reply).split('\n');

    for (const part of parts) {
      await typeLine(part, { msPerChar: 2 });
    }
    return;
  }

  try {
    const { reply } = await haunt(message);
    thinking.remove();

    await sleep(150 + Math.random() * 450);

    const parts = String(reply)
      .split('\n')
      .map((s) => s.trimEnd())
      .filter(Boolean);

    for (const part of parts) {
      await typeLine(part, {
        msPerChar: 8 + Math.floor(Math.random() * 10),
      });
    }
  } catch (err) {
    thinking.remove();
    addLine(`[error] ${String(err.message || err)}`, { dim: true });
  }
});

/**
 * Random glitch bursts (applies to the rounded screen only)
 */
function scheduleGlitch() {
  const waitMs = 600 + Math.random() * 4000;
  window.setTimeout(() => {
    screen.classList.add('glitch');

    const durationMs = 50 + Math.random() * 250;
    window.setTimeout(() => {
      screen.classList.remove('glitch');
      scheduleGlitch();
    }, durationMs);
  }, waitMs);
}

scheduleGlitch();
