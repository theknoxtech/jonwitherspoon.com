/* ---- Retire every question that was written from the lab guide.
   The bank is built only from Microsoft documentation. Ids are kept, so saved progress still lines up. ---- */
for (let i = Q.length - 1; i >= 0; i--) if (/^Lab \d/.test(Q[i].t)) Q.splice(i, 1);
