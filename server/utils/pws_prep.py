import os
import sys
import pandas as pd
import numpy as np

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pypws.materials import get_dnv_components

def get_pws_materials():
  mats = get_dnv_components()
  return mats

def parse_data_for_export(mats):
  out = []
  for mat in mats:
    a = str(mat.cas_id)
    out.append({
      'cas_id': mat.cas_id,
      'cas_no':  f"{a[:-3]}-{a[-3:-1]}-{a[-1]}",
      'chem_name': mat.name,
    })
  return out

def export_csv(chems_list_of_dicts):
  df = pd.DataFrame(chems_list_of_dicts)
  df.to_csv("cheminfo.csv", index=False)


def main():
  # cas_ids = get_all_cas_ids()
  # mat_ids = get_materials_from_cas_ids(cas_ids)
  # chem_names = get_chem_names(mat_ids)
  # export_csv(cas_ids, chem_names)
  mats = get_pws_materials()
  chems_list_of_dicts = parse_data_for_export(mats)
  export_csv(chems_list_of_dicts)

  apple = 1

if __name__ == '__main__':
  main()