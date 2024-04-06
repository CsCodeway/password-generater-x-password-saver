import { useCallback, useEffect, useRef, useState } from "react";

const App = () => {
  const [numberAllow, setNumberAllow] = useState(true);
  const [charAllow, setCharAllow] = useState(true);
  const [length, setLength] = useState(8);
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const [title, setTitle] = useState("");
  const [passValue, setPassValue] = useState("");
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(null);

  const generatePassword = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllow) str += "0123456789";
    if (charAllow) str += "!@#$%^&*(){}[]";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, numberAllow, charAllow, setPassword]);

  useEffect(() => {
    generatePassword();
  }, [length, numberAllow, charAllow, generatePassword, setPassword]);

  const copyPassword = () => {
    passwordRef.current.select();
    window.navigator.clipboard.writeText(password);
  };

  const createData = (e) => {
    e.preventDefault();
    if (!title.trim() || !passValue.trim()) return false;
    if (edit != null) {
      let updatedData = [...data];
      updatedData[edit] = [title, passValue];
      setData(updatedData);
      const newData = JSON.stringify(updatedData);
      localStorage.setItem("Title-Password", newData);
      setEdit(null);
    } else {
      let value = [title, passValue];
      setData([value, ...data]);
      const newData = JSON.stringify([value, ...data]);
      localStorage.setItem("Title-Password", newData);
    }
    setTitle("");
    setPassValue("");
  };

  useEffect(() => {
    let getData = localStorage.getItem("Title-Password");
    if (getData) {
      let data = JSON.parse(getData);
      setData(data);
    }
  }, [setData]);

  const editData = (index) => {
    const value = data[index];
    setTitle(value[0]);
    setPassValue(value[1]);
    setEdit(index);
  };
  const deleteData = () => {
    let updatedData = [...data];
    updatedData.splice(edit, 1);
    setData(updatedData);
    const newData = JSON.stringify(updatedData);
    localStorage.setItem("Title-Password", newData);
    setEdit(null);
  };
  return (
    <>
      <div className="grid place-items-center">
        <div className="w-full sm:max-w-[550px] flex flex-col items-center shadow-sm p-5 bg-gray-500 text-white gap-4 rounded-t-lg">
          <h1 className="font-semibold text-xl">Password Generator</h1>
          <div className="w-full flex">
            <input
              type="text"
              id="password"
              value={password}
              placeholder="Password"
              readOnly
              ref={passwordRef}
              className="flex-1 text-gray-600 text-center outline-none border-none rounded-s-lg selection:bg-gray-200"
            />
            <button
              onClick={copyPassword}
              className="px-4 py-1 bg-blue-500 rounded-e-lg"
            >
              Copy
            </button>
          </div>
          <div className="flex items-center justify-center">
            <input
              type="range"
              id="length"
              min={6}
              max={15}
              value={length}
              onChange={(e) => {
                setLength(e.target.value);
              }}
              className="cursor-pointer"
            />
            <label htmlFor="length" className="px-1 pr-4">
              {length}
            </label>
            <input
              type="checkbox"
              defaultChecked={numberAllow}
              id="numberInput"
              onChange={() => {
                setNumberAllow((prev) => !prev);
              }}
              className="cursor-pointer"
            />
            <label htmlFor="numberInput" className="cursor-pointer px-1 pr-4">
              Numbers
            </label>
            <input
              type="checkbox"
              defaultChecked={charAllow}
              id="charInput"
              onChange={() => {
                setCharAllow((prev) => !prev);
              }}
              className="cursor-pointer"
            />
            <label htmlFor="charInput" className="cursor-pointer px-1 pr-4">
              Characters
            </label>
          </div>
        </div>
        <div className="w-full sm:max-w-[550px] flex flex-col items-center shadow-sm p-5 bg-gray-400 text-white gap-4 rounded-b-lg">
        <h1 className="font-semibold text-xl">Password Saver</h1>
          <form
            onSubmit={createData}
            className="w-full flex flex-col sm:flex-row space-y-2 sm:space-y-0"
            autoComplete="off"
          >
            <input
              type="text"
              placeholder="Tital"
              value={title}
              id="tital"
              className="flex-1 text-gray-600 px-2 outline-none border-r rounded-lg sm:rounded-s-lg sm:rounded-e-none selection:bg-gray-200"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              id="passValue"
              value={passValue}
              placeholder="Password"
              maxLength={15}
              className="flex-1 text-gray-600 px-2 outline-none border-l rounded-lg sm:rounded-s-none sm:rounded-e-none
               selection:bg-gray-200"
              onChange={(e) => setPassValue(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-1 bg-blue-500 rounded-lg sm:rounded-e-lg sm:rounded-s-none"
            >
              {edit != null ? "Update" : "Add"}
            </button>
          </form>
          {data.map((item, index) => {
            const [firstItem, secondItem] = item;
            return (
              <div
                key={index}
                className="flex justify-between items-center w-full"
              >
                <div className="flex flex-col items-center">
                  <div className="text-center text-wrap">{firstItem}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-center">{secondItem}</div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => editData(index)}>Edit</button>
                  <button onClick={deleteData}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default App;
