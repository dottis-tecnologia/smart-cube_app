import { useEffect } from "react";
import { deleteDatabase, getDatabase, query } from "../../util/db";
import { Button } from "native-base";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";

export type SyncProps = {};

export default function Sync({}: SyncProps) {
  const getRows = async () => {
    const res = await query("select * from meters;");
    console.log(res?.rows);
  };
  const addRow = async () => {
    const db = await getDatabase();

    db.exec(
      [
        {
          sql: `INSERT INTO meters (id, location, unit) VALUES (?, ?, ?)`,
          args: [makeid(5).toUpperCase(), makeid(8), "kWh"],
        },
      ],
      false,
      (e, r) => {
        console.log(e, r);
      }
    );
  };

  return (
    <>
      <FocusAwareStatusBar style="dark" />
      <Button onPress={deleteDatabase}>Delete db</Button>
      <Button onPress={getRows}>Get rows</Button>
      <Button onPress={addRow}>insert row</Button>
    </>
  );
}
function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
