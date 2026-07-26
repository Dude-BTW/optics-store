export function initRecaptchaV3({
  siteKey,
  action,
  lifespan = 110000,
  container,
  tokenInputSelector,
  versionInputSelector,
  trackedElements = [],
  globalEvents = ["mousemove", "keydown", "scroll", "click"],
}) {
  let _token = null;
  let _timestamp = 0;
  let _timerId = null;
  let _inProgress = false;
  let _generated = false;

  function scheduleExpiry() {
    if (_timerId) clearTimeout(_timerId);
    _timerId = setTimeout(() => {
      _token = null;
      _timestamp = 0;
      _generated = false;
    }, lifespan);
  }

  function generateToken() {
    if (_inProgress) return Promise.resolve(_token);
    _inProgress = true;
    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(siteKey, { action }).then((token) => {
          _token = token;
          _timestamp = Date.now();
          _inProgress = false;
          _generated = true;
          if (container && tokenInputSelector && versionInputSelector) {
            container.querySelector(tokenInputSelector).value = token;
            container.querySelector(versionInputSelector).value = "v3";
          }
          scheduleExpiry();
          resolve(token);
        });
      });
    });
  }

  function handleInteraction() {
    if (!_generated) {
      generateToken();
    } else if (Date.now() - _timestamp > lifespan) {
      generateToken();
    } else {
      scheduleExpiry();
    }
  }

  trackedElements.forEach((el) => {
    if (!el) return;
    el.addEventListener("click", handleInteraction);
    el.addEventListener("input", handleInteraction);
  });

  globalEvents.forEach((evt) => {
    document.addEventListener(evt, handleInteraction, { passive: true });
  });

  return { generateToken };
}
