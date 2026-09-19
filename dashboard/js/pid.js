const pidOpenButton = document.getElementById('pidOpen');
const pidModal = document.getElementById('pidModal');
const pidCloseButton = document.getElementById('pidClose');
const pidCloseBottom = document.getElementById('pidCloseBottom');
const pidApplyButton = document.getElementById('pidApply');
const pidSaveButton = document.getElementById('pidSave');
const pidResetButton = document.getElementById('pidReset');

const defaultPidValues = {
  roll: { kp: 4.5, ki: 0.02, kd: 0.15 },
  pitch: { kp: 0.699, ki: 0.039, kd: 0.11 },
  yaw: { kp: 0.18, ki: 0.0, kd: 0.0 },
};

function openPidModal() {
  pidModal.classList.add('open');
}

function closePidModal() {
  pidModal.classList.remove('open');
}

pidOpenButton.onclick = openPidModal;
pidCloseButton.onclick = closePidModal;
pidCloseBottom.onclick = closePidModal;
pidModal.onclick = (event) => {
  if (event.target === pidModal) {
    closePidModal();
  }
};

pidApplyButton.onclick = () => {
  // Apply values in the current modal to the UI state.
  const rollKp = parseFloat(document.getElementById('pidRollKp').value) || 0;
  const rollKi = parseFloat(document.getElementById('pidRollKi').value) || 0;
  const rollKd = parseFloat(document.getElementById('pidRollKd').value) || 0;
  const pitchKp = parseFloat(document.getElementById('pidPitchKp').value) || 0;
  const pitchKi = parseFloat(document.getElementById('pidPitchKi').value) || 0;
  const pitchKd = parseFloat(document.getElementById('pidPitchKd').value) || 0;
  const yawKp = parseFloat(document.getElementById('pidYawKp').value) || 0;
  const yawKi = parseFloat(document.getElementById('pidYawKi').value) || 0;
  const yawKd = parseFloat(document.getElementById('pidYawKd').value) || 0;
  console.log('PID apply', {rollKp, rollKi, rollKd, pitchKp, pitchKi, pitchKd, yawKp, yawKi, yawKd});
  closePidModal();
};

pidSaveButton.onclick = () => {
  // Save the PID values to localStorage for persistence between loads.
  const pidValues = {
    roll: {
      kp: parseFloat(document.getElementById('pidRollKp').value) || 0,
      ki: parseFloat(document.getElementById('pidRollKi').value) || 0,
      kd: parseFloat(document.getElementById('pidRollKd').value) || 0,
    },
    pitch: {
      kp: parseFloat(document.getElementById('pidPitchKp').value) || 0,
      ki: parseFloat(document.getElementById('pidPitchKi').value) || 0,
      kd: parseFloat(document.getElementById('pidPitchKd').value) || 0,
    },
    yaw: {
      kp: parseFloat(document.getElementById('pidYawKp').value) || 0,
      ki: parseFloat(document.getElementById('pidYawKi').value) || 0,
      kd: parseFloat(document.getElementById('pidYawKd').value) || 0,
    },
  };
  localStorage.setItem('uavPidValues', JSON.stringify(pidValues));
  console.log('PID saved', pidValues);
};

pidResetButton.onclick = () => {
  document.getElementById('pidRollKp').value = defaultPidValues.roll.kp;
  document.getElementById('pidRollKi').value = defaultPidValues.roll.ki;
  document.getElementById('pidRollKd').value = defaultPidValues.roll.kd;
  document.getElementById('pidPitchKp').value = defaultPidValues.pitch.kp;
  document.getElementById('pidPitchKi').value = defaultPidValues.pitch.ki;
  document.getElementById('pidPitchKd').value = defaultPidValues.pitch.kd;
  document.getElementById('pidYawKp').value = defaultPidValues.yaw.kp;
  document.getElementById('pidYawKi').value = defaultPidValues.yaw.ki;
  document.getElementById('pidYawKd').value = defaultPidValues.yaw.kd;
  localStorage.setItem('uavPidValues', JSON.stringify(defaultPidValues));
};

function loadPidValues() {
  try {
    const saved = JSON.parse(localStorage.getItem('uavPidValues') || localStorage.getItem('uavPid') || '{}');
    const isLegacyPitch = saved.pitch && saved.pitch.kp === 0.6 && saved.pitch.ki === 0.3 && saved.pitch.kd === 0.2;
    const mergedValues = {
      roll: { ...defaultPidValues.roll, ...(saved.roll || {}) },
      pitch: isLegacyPitch ? defaultPidValues.pitch : { ...defaultPidValues.pitch, ...(saved.pitch || {}) },
      yaw: { ...defaultPidValues.yaw, ...(saved.yaw || {}) },
    };

    document.getElementById('pidRollKp').value = mergedValues.roll.kp;
    document.getElementById('pidRollKi').value = mergedValues.roll.ki;
    document.getElementById('pidRollKd').value = mergedValues.roll.kd;
    document.getElementById('pidPitchKp').value = mergedValues.pitch.kp;
    document.getElementById('pidPitchKi').value = mergedValues.pitch.ki;
    document.getElementById('pidPitchKd').value = mergedValues.pitch.kd;
    document.getElementById('pidYawKp').value = mergedValues.yaw.kp;
    document.getElementById('pidYawKi').value = mergedValues.yaw.ki;
    document.getElementById('pidYawKd').value = mergedValues.yaw.kd;

    if (isLegacyPitch || !saved.pitch) {
      localStorage.setItem('uavPidValues', JSON.stringify(mergedValues));
    }
  } catch (error) {
    console.warn('Failed to load saved PID values', error);
  }
}

loadPidValues();
