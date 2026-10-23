import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import BMI3DVisualizer from '../components/BMI3DVisualizer';
import TiltCard3D from '../components/TiltCard3D';

const INFO = {
  Underweight: 'Your weight is below the typical range. Focus on nutrient-rich meals and strength training.',
  Healthy: 'Your weight is in the healthy range. Keep your routine of balanced food and regular exercise.',
  Overweight: 'Your weight is above the typical range. Small changes to food and daily activity help a lot.',
  Obese: 'Your weight is well above the typical range. A doctor can help you build a safe plan.',
};

export default function BMI() {
  const [h, setH] = useState('175');
  const [w, setW] = useState('70');
  const [err, setErr] = useState({});
  const [res, setRes] = useState({
    bmi: '22.9',
    cat: 'Healthy',
    pos: Math.min(100, Math.max(0, ((22.9 - 12) / 28) * 100)),
  });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    const hn = parseFloat(h);
    const wn = parseFloat(w);
    if (!h || isNaN(hn)) er.h = 'Enter your height in cm.';
    else if (hn < 50 || hn > 250) er.h = 'Height must be between 50 and 250 cm.';
    if (!w || isNaN(wn)) er.w = 'Enter your weight in kg.';
    else if (wn < 10 || wn > 300) er.w = 'Weight must be between 10 and 300 kg.';
    setErr(er);
    if (Object.keys(er).length) return setRes(null);
    const bmiVal = wn / ((hn / 100) ** 2);
    const cat =
      bmiVal < 18.5
        ? 'Underweight'
        : bmiVal < 25
        ? 'Healthy'
        : bmiVal < 30
        ? 'Overweight'
        : 'Obese';
    setRes({
      bmi: bmiVal.toFixed(1),
      cat,
      pos: Math.min(100, Math.max(0, ((bmiVal - 12) / 28) * 100)),
    });
  };

  return (
    <>
      <PageHeader
        title="3D Biometric BMI Calculator"
        sub="Body mass index analysis with dynamic 3D holographic dial and category feedback."
      />
      <section className="split">
        <TiltCard3D>
          <form className="card form card-3d-inner" onSubmit={submit} noValidate>
            <div className="form-head">
              <span className="pill">Input Metrics</span>
              <h3>Calculate Your Index</h3>
            </div>
            <label>
              Height (cm)
              <input
                type="number"
                value={h}
                onChange={(e) => setH(e.target.value)}
                placeholder="e.g. 175"
                className={err.h ? 'bad' : ''}
              />
              {err.h && <em>{err.h}</em>}
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                value={w}
                onChange={(e) => setW(e.target.value)}
                placeholder="e.g. 70"
                className={err.w ? 'bad' : ''}
              />
              {err.w && <em>{err.w}</em>}
            </label>
            <Button type="submit" full>
              ⚡ Compute 3D Metric
            </Button>
          </form>
        </TiltCard3D>

        <TiltCard3D>
          <div className="card result card-3d-inner">
            <BMI3DVisualizer
              bmi={res ? res.bmi : 22.0}
              category={res ? res.cat : 'Healthy'}
            />

            {res ? (
              <>
                <p className="muscle">Current Biometric Assessment</p>
                <div className="bmi-num">{res.bmi}</div>
                <span className={`level ${res.cat.toLowerCase()}`}>{res.cat}</span>
                <div className="gauge">
                  <i style={{ left: `${res.pos}%` }} />
                </div>
                <div className="scale">
                  <span>Under 18.5</span>
                  <span>18.5-24.9</span>
                  <span>25-29.9</span>
                  <span>30+</span>
                </div>
                <p>{INFO[res.cat]}</p>
              </>
            ) : (
              <>
                <h3>Your result appears here</h3>
                <p>Enter your height and weight, then press Compute 3D Metric.</p>
                <ul className="ticks">
                  <li>Under 18.5: underweight</li>
                  <li>18.5 to 24.9: healthy</li>
                  <li>25 to 29.9: overweight</li>
                  <li>30 and above: obese</li>
                </ul>
              </>
            )}
          </div>
        </TiltCard3D>
      </section>

      <div className="row">
        <Button to="/goals">Set a goal from your result</Button>
        <Button to="/studio" variant="ghost">Simulate in 3D Studio</Button>
        <Button to="/diet" variant="ghost">See nutrition tips</Button>
      </div>
    </>
  );
}
